import { ref, computed, watch, type Ref, nextTick, onUnmounted } from 'vue'
import type { TableColumn, ColumnOption, ColumnConfig } from '../table'

interface UseColumnControlProps {
  columnConfig: ColumnConfig
  allColumns: TableColumn[]
  // defaultVisibleColumns: string[];
}

interface UseColumnControlReturn {
  // 状态
  dragStartIndex: Ref<number>
  dragOverIndex: Ref<number>
  draggingIndex: Ref<number>
  originalConfig: Ref<ColumnConfig | null>
  // 计算属性
  displayColumnOptions_1: Ref<any>
  displayColumnOptions_2: Ref<any>
  // 方法
  handleVisibleChange: (newVisible: boolean) => void
  handleColumnToggle: (colKey: string, checked: boolean) => void
  handlePointerDown: (index: number, event: PointerEvent) => void
  handlePointerMove: (event: PointerEvent) => void
  handlePointerUp: (event: PointerEvent) => void
  doReorder: (targetIndex: number) => Promise<void>
  handleSave: () => void
  handleCancel: () => void
}

export function useColumnControl(
  props: UseColumnControlProps,
  emit: (event: any, ...args: any[]) => void,
  visibleModel: Ref<boolean>,
  columnConfigModel: Ref<ColumnConfig>
): UseColumnControlReturn {
  // 内部响应式数据
  const dragStartIndex = ref<number>(-1)
  const dragOverIndex = ref<number>(-1)
  const draggingIndex = ref<number>(-1)
  const originalConfig = ref<ColumnConfig | null>(null)
  // 计算属性
  const displayColumnOptions_1 = computed<any>(() => {
    // 修复：let resultColumns = [] 会被 TS 推断为 never[]，赋 ColumnOption[] 报 TS2322
    let resultColumns: any[] = []
    if (columnConfigModel.value.columnOptions.length > 0) {
      // 如果有配置好的列，就使用它
      resultColumns = columnConfigModel.value.columnOptions
    } else {
      // 否则，从 allColumns 生成
      resultColumns = [...props.allColumns]
    }
    // 关键步骤：对最终结果进行统一过滤
    // return resultColumns.filter((col) => col.value !== "row-select");
    return resultColumns.filter((s: any) => s.head_disabled === true || s.colKey === 'row-select')
  })
  // 计算属性
  const displayColumnOptions_2 = computed<any>(() => {
    let resultColumns: any[] = []
    if (columnConfigModel.value.columnOptions.length > 0) {
      // 如果有配置好的列，就使用它
      resultColumns = columnConfigModel.value.columnOptions
    } else {
      // 否则，从 allColumns 生成
      resultColumns = [...props.allColumns]
    }
    // 关键步骤：对最终结果进行统一过滤
    // 关键：获取不可拖拽列的 colKey 集合，过滤掉重复项
    const disabledColKeys = displayColumnOptions_1.value.map((item: any) => item.colKey)
    return resultColumns.filter(
      (s: any) => s.head_disabled !== true && !disabledColKeys.includes(s.colKey)
    )
  })
  // 监听 visible 变化，记录原始配置
  watch(visibleModel, (newValue: boolean) => {
    if (newValue && !originalConfig.value) {
      originalConfig.value = JSON.parse(JSON.stringify(columnConfigModel.value))
    }
    if (!newValue) {
      originalConfig.value = null
    }
  })
  // 弹出层显示状态变化
  const handleVisibleChange = (newVisible: boolean): void => {
    visibleModel.value = newVisible
    if (!newVisible) {
      // handleCancel();
    }
  }
  // 列显示/隐藏切换
  const handleColumnToggle = async (colKey: string, checked: boolean) => {
    // console.log(
    //   '🍧-----displayColumnOptions-----',
    //   columnConfigModel.value.visibleColumns
    // )
    let newVisibleColumns: string[]
    if (checked) {
      newVisibleColumns = [...columnConfigModel.value.visibleColumns, colKey]
    } else {
      // 防止隐藏所有列
      if (columnConfigModel.value.visibleColumns.length <= 1) {
        return
      }
      newVisibleColumns = columnConfigModel.value.visibleColumns.filter((col) => col !== colKey)
    }
    columnConfigModel.value = {
      ...columnConfigModel.value,
      visibleColumns: newVisibleColumns,
    }
    emit('columnToggle', colKey, checked, columnConfigModel.value)
    await nextTick()
    handleSave()
  }
  // ===== 自定义拖拽（Pointer Events 实现，兼容鼠标/触摸/WebView，不依赖浏览器原生 HTML5 DnD）=====
  // 按下位置与是否已激活拖拽（非响应式内部状态，无需触发渲染）
  let pointerStartX = 0
  let pointerStartY = 0
  let pointerDragging = false
  const DRAG_THRESHOLD = 4 // 移动超过 4px 才判定为拖拽，避免误触

  const handlePointerDown = (index: number, event: PointerEvent): void => {
    // 仅响应鼠标左键（触摸/触笔 button 为 0）
    if (event.button !== 0) return
    // 防止重复绑定
    document.removeEventListener('pointermove', handlePointerMove)
    document.removeEventListener('pointerup', handlePointerUp)
    dragStartIndex.value = index
    pointerStartX = event.clientX
    pointerStartY = event.clientY
    pointerDragging = false
    document.addEventListener('pointermove', handlePointerMove)
    document.addEventListener('pointerup', handlePointerUp)
  }

  const handlePointerMove = (event: PointerEvent): void => {
    if (!pointerDragging) {
      const dx = Math.abs(event.clientX - pointerStartX)
      const dy = Math.abs(event.clientY - pointerStartY)
      if (dx <= DRAG_THRESHOLD && dy <= DRAG_THRESHOLD) return
      // 超过阈值：正式进入拖拽，源行进入拖起态
      pointerDragging = true
      draggingIndex.value = dragStartIndex.value
    }
    dragOverIndex.value = getHoverItemIndex(event.clientX, event.clientY)
  }

  // 根据当前指针坐标定位悬停的可拖拽行（遍历弹层内可拖行的 rect 判断命中，
  // 不依赖 elementFromPoint，避免弹层 teleport/层级导致命中组件根而非行元素）
  const getHoverItemIndex = (x: number, y: number): number => {
    const popup = document.querySelector('.column-control-popup')
    if (!popup) return -1
    const items = Array.from(popup.querySelectorAll<HTMLElement>('[data-draggable-item]'))
    for (let i = 0; i < items.length; i++) {
      const el = items[i]
      const r = el.getBoundingClientRect()
      if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) {
        const idx = Number(el.dataset.index)
        return Number.isNaN(idx) ? -1 : idx
      }
    }
    return -1
  }

  const handlePointerUp = (event: PointerEvent): void => {
    document.removeEventListener('pointermove', handlePointerMove)
    document.removeEventListener('pointerup', handlePointerUp)
    if (pointerDragging) {
      const targetIndex = getHoverItemIndex(event.clientX, event.clientY)
      if (targetIndex !== -1 && targetIndex !== dragStartIndex.value) {
        doReorder(targetIndex)
      }
    }
    resetDragState()
  }

  const resetDragState = (): void => {
    dragStartIndex.value = -1
    dragOverIndex.value = -1
    draggingIndex.value = -1
    pointerDragging = false
  }

  // 实际排序：把源行移动到目标行位置，合并去重后写回 columnConfig
  const doReorder = async (targetIndex: number) => {
    const newColumnOptions = [...displayColumnOptions_2.value]
    const movedItem: any = newColumnOptions.splice(dragStartIndex.value, 1)[0]
    newColumnOptions.splice(targetIndex, 0, movedItem)
    // 合并不可拖拽列 + 去重后的可拖拽列
    const disabledColKeys = displayColumnOptions_1.value.map((item: any) => item.colKey)
    const uniqueDraggableColumns = newColumnOptions.filter(
      (item: any) => !disabledColKeys.includes(item.colKey)
    )
    const fullColumnOptions = [...displayColumnOptions_1.value, ...uniqueDraggableColumns]
    const finalColumnOptions = Array.from(
      new Map(fullColumnOptions.map((item) => [item.colKey, item]))
    ).map(([_, item]) => item)
    columnConfigModel.value = {
      ...columnConfigModel.value,
      columnOptions: finalColumnOptions,
    }
    emit('columnOrderChange', newColumnOptions)
    await nextTick()
    handleSave()
  }
  // 组件卸载时清理 document 级监听
  onUnmounted(() => {
    document.removeEventListener('pointermove', handlePointerMove)
    document.removeEventListener('pointerup', handlePointerUp)
  })
  // 保存到服务器
  const handleSave = async () => {
    console.log('🌳-----columnConfigModel.value-----', columnConfigModel.value)
    emit('save', columnConfigModel.value)
    // visibleModel.value = false;
    // originalConfig.value = null;
  }
  // 取消功能 - 恢复到原始状态
  const handleCancel = (): void => {
    if (originalConfig.value) {
      columnConfigModel.value = JSON.parse(JSON.stringify(originalConfig.value))
    }
    visibleModel.value = false
    emit('cancel')
    originalConfig.value = null
  }
  return {
    // 状态
    dragStartIndex,
    dragOverIndex,
    draggingIndex,
    originalConfig,
    // 计算属性
    displayColumnOptions_1,
    displayColumnOptions_2,
    // 方法
    handleVisibleChange,
    handleColumnToggle,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    doReorder,
    handleSave,
    handleCancel,
  }
}
