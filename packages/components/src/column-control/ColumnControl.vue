<template>
  <t-popup
    :visible="visibleModel"
    destroy-on-close
    trigger="click"
    placement="bottom-left"
    :overlay-style="{ padding: '8px 0' }"
    @visible-change="handleVisibleChange"
  >
    <!-- 触发按钮 -->
    <slot>
      <t-button variant="outline" size="small">
        <template #icon><t-icon name="setting" /></template>
        列设置
      </t-button>
    </slot>
    <!-- 弹出内容 -->
    <template #content>
      <div class="column-control-popup">
        <!-- 头部 -->
        <div class="popup-header">
          <div class="popup-title">表头展示项目</div>
        </div>
        <!-- 列列表 -->
        <div class="column-list">
          <template
            v-for="option in displayColumnOptions_1"
            :key="option.colKey"
          >
            <div v-if="!option.Coldisabled" class="column-item">
              <div class="switch-container">
                <!-- <span class="column-title">{{ option.label }}</span> -->
                <div class="switch-handle-container">
                  <CbIcon
                    style="margin-right: 12px"
                    :size="'16px'"
                    :name="'tuozhuai'"
                  />
                  <span class="column-title" style="margin-right: auto">{{
                    option.displayName || option.title
                  }}</span>
                  <t-switch
                    :value="
                      columnConfigModel.visibleColumns.includes(option.colKey)
                    "
                    :disabled="option.head_disabled"
                    size="small"
                    @change="
                      (value: boolean) =>
                        handleColumnToggle(option.colKey, value)
                    "
                  />
                </div>
              </div>
            </div>
          </template>
          <template
            v-for="(option, index) in displayColumnOptions_2"
            :key="option.colKey"
          >
            <div
              v-if="!option.Coldisabled"
              class="column-item"
              :class="{
                'drag-over': dragOverIndex === index,
                dragging: draggingIndex === index,
              }"
              data-draggable-item
              :data-index="index"
              @pointerdown="handlePointerDown(index, $event)"
            >
              <div class="switch-container">
                <!-- <span class="column-title">{{ option.label }}</span> -->
                <div class="switch-handle-container">
                  <CbIcon
                    style="margin-right: 12px"
                    :size="'16px'"
                    :name="'tuozhuai'"
                  />
                  <span class="column-title" style="margin-right: auto">{{
                    option.displayName || option.title
                  }}</span>
                  <t-switch
                    :value="
                      columnConfigModel.visibleColumns.includes(option.colKey)
                    "
                    :disabled="option.head_disabled || option.Prohibit_switch"
                    size="small"
                    @change="
                      (value: boolean) =>
                        handleColumnToggle(option.colKey, value)
                    "
                  />
                </div>
              </div>
            </div>
          </template>
          <div v-if="closeoperation" class="column-item">
            <div class="switch-container">
              <div class="switch-handle-container">
                <CbIcon
                  style="margin-right: 12px"
                  :size="'16px'"
                  :name="'tuozhuai'"
                />
                <span class="column-title" style="margin-right: auto">{{
                  displayColumnOptions_2.filter(
                    (item: any) => item.Coldisabled
                  )?.[0]?.displayName || "操作"
                }}</span>
                <t-switch
                  :value="
                    columnConfigModel.visibleColumns.includes('operation')
                  "
                  :disabled="true"
                  size="small"
                  @change="
                    (value: boolean) => handleColumnToggle('operation', value)
                  "
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </t-popup>
</template>
<script setup lang="ts">
import type { TableColumn, ColumnOption, ColumnConfig } from './table'
import { useColumnControl } from './hooks'
defineOptions({
  name: 'CbColumnControl',
})
// 使用 defineModel 定义双向绑定的 props
const columnConfigModel = defineModel<ColumnConfig>('columnConfig', {
  required: true,
  default: () => ({
    visibleColumns: [],
    columnOptions: [],
  }),
})
const visibleModel = defineModel<boolean>('visible', {
  default: false,
})
// 普通 props
interface Props {
  allColumns: TableColumn[]
  // defaultVisibleColumns: string[];
  // 新增保存函数
  onSave?: (config: ColumnConfig) => Promise<void> | void
  closeoperation?: boolean // 控制是否显示操作列的开关按钮
}
const props = withDefaults(defineProps<Props>(), {
  allColumns: () => [],
  closeoperation: true,
  // defaultVisibleColumns: () => [],
})
// Emits - 移除了 save，新增成功和错误事件
const emit = defineEmits<{
  saveSuccess: [config: ColumnConfig]
  saveError: [error: any]
  columnToggle: [colKey: string, checked: boolean]
  columnOrderChange: [newOrder: ColumnOption[]]
}>()
// 使用 hooks
const {
  // 状态
  dragOverIndex,
  draggingIndex,
  // 计算属性
  displayColumnOptions_1, //不可拖拽列
  displayColumnOptions_2, //可拖拽列
  // 方法
  handleVisibleChange,
  handleColumnToggle,
  handlePointerDown,
  handlePointerMove,
  handlePointerUp,
  doReorder,
} = useColumnControl(
  {
    columnConfig: columnConfigModel.value,
    allColumns: props.allColumns,
    // defaultVisibleColumns: props.defaultVisibleColumns,
  },
  emit,
  visibleModel,
  columnConfigModel
)
</script>
<style scoped>
.column-control-popup {
  width: 200px; /* 稍微加宽以容纳开关 */
  padding: 12px 8px;
  box-sizing: border-box;
  background: #ffffff;
  border-radius: 2px;
}
.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
.popup-title {
  color: #333333;
  font-family: "HONOR Sans CN";
  font-weight: 600;
  font-size: 14px;
}
.column-list {
  /* max-height: 300px; */
  max-height: 50vh;
  overflow-y: auto;
}
.column-item {
  transition: all 0.3s;
  margin-bottom: 8px;
  display: flex;
  height: 32px;
  align-items: center;
  user-select: none;
}
.column-item:hover {
  background-color: var(--td-bg-color-container-hover);
  border-color: var(--td-brand-color-light);
}
.column-item.drag-over {
  border: 2px dashed var(--td-brand-color);
  background-color: var(--td-brand-color-light);
  transform: scale(1.02);
  position: relative;
  z-index: 1;
}
/* 可拖拽行：提供抓手光标提示 */
.column-item[data-draggable-item] {
  cursor: grab;
}
.column-item[data-draggable-item]:active {
  cursor: grabbing;
}
/* 拖起中的源行：半透明 + 虚化，明确"已被拿起" */
.column-item.dragging {
  opacity: 0.45;
  background-color: var(--td-bg-color-container-hover);
}
/* 拖拽悬停目标行：上/下插入指示线，明确放置位置 */
.column-item.drag-over::before,
.column-item.drag-over::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--td-brand-color);
  border-radius: 2px;
  pointer-events: none;
}
.column-item.drag-over::before {
  top: -5px;
}
.column-item.drag-over::after {
  bottom: -5px;
}
.column-item.loading {
  opacity: 0.6;
  pointer-events: none;
}
.switch-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  /* padding: 0 8px; */
}
.column-title {
  color: #666666;
  font-family: "PingFang SC";
  font-size: 14px;
  flex: 1;
}
.switch-handle-container {
  display: flex;
  align-items: center;
  /* gap: 8px; */
  width: 100%;
  .t-is-disabled {
    background-color: var(--td-bg-color-component-disabled);
  }
}
.drag-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
/* 滚动条样式 */
.column-list::-webkit-scrollbar {
  display: none;
  width: 4px;
}
.column-list::-webkit-scrollbar-track {
  background: var(--td-bg-color-container);
  border-radius: 2px;
}
.column-list::-webkit-scrollbar-thumb {
  background: var(--td-component-stroke);
  border-radius: 2px;
}
.column-list::-webkit-scrollbar-thumb:hover {
  background: var(--td-text-color-placeholder);
}
</style>
