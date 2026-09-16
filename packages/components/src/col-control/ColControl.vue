<template>
  <div class="cb-col-control">
    <span>{{ label }}</span>
    <t-popup trigger="click" destroy-on-close placement="bottom-left" v-bind="popupProps">
      <template #content>
        <div class="cb-col-control-content">
          <div class="cb-col-control-title">
            表头展示项目
            <t-link theme="primary" @click="handleReset">重置</t-link>
          </div>
          <div
            v-for="item in leftFixedItems"
            :key="item.colKey"
            class="cb-col-control-item no-drag"
          >
            <div class="item-label">
              <CbIcon size="16px" name="tuozhuai" class="disabled-icon" />
              {{ getTitle(item) }}
            </div>
            <t-switch :value="true" :disabled="true" />
          </div>
          <vue-draggable
            v-model="draggableList"
            item-key="colKey"
            handle=".drag-handle"
            :animation="200"
          >
            <div v-for="item in draggableList" :key="item.colKey" class="cb-col-control-item">
              <div class="drag-handle">
                <CbIcon size="16px" name="tuozhuai" />
                {{ getTitle(item) }}
              </div>
              <t-switch
                v-model="item.visible"
                :disabled="item.disabled"
                @change="syncToParent(true)"
              />
            </div>
          </vue-draggable>
          <div
            v-for="item in rightFixedItems"
            :key="item.colKey"
            class="cb-col-control-item no-drag"
          >
            <div class="item-label">
              <CbIcon size="16px" name="tuozhuai" class="disabled-icon" />
              {{ getTitle(item) }}
            </div>
            <t-switch :value="true" :disabled="true" />
          </div>
        </div>
      </template>
      <cb-icon name="shezhi" style="cursor: pointer" />
    </t-popup>
  </div>
</template>
<script lang="ts" setup>
import { getHeaderColumnList, tableHeaderSave } from '#/api/index'
import { computed, onMounted, ref, watch, type PropType } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'
import type { ColControlColumn } from './types'
defineOptions({ name: 'CbColControl' })
const props = defineProps({
  label: { type: String, default: '操作' },
  options: { type: Array as PropType<ColControlColumn[]>, default: () => [] },
  appCode: { type: String, required: true },
  tableCode: { type: String, required: true },
  popupProps: {
    type: Object as PropType<Record<string, unknown>>,
    default: () => ({}),
  },
})
const modelValue = defineModel<ColControlColumn[]>()
const localColumns = ref<ColControlColumn[]>([])
const isSystemCol = (item: ColControlColumn) =>
  ['row-select', 'drag', 'serial-number'].includes(item.colKey) ||
  (!item.title && !item.dispalyTitle && !item.displayName)
const isLeftFixed = (item: ColControlColumn) => item.fixed === 'left' && !isSystemCol(item)
const isRightFixed = (item: ColControlColumn) => item.fixed === 'right' || item.colKey === 'operation'
const isEdit = (item: ColControlColumn) => !isSystemCol(item) && !isLeftFixed(item) && !isRightFixed(item)
const getTitle = (item: ColControlColumn) => {
  return (
    item.displayName ||
    item.dispalyTitle ||
    (typeof item.title === 'string' ? item.title : item.colKey)
  )
}
const syncToParent = (shouldSave = false) => {
  const visibleCols = localColumns.value.filter((item) => item.visible !== false)
  modelValue.value = [...visibleCols]
  if (shouldSave) {
    debounceSave()
  }
}
let timer: ReturnType<typeof setTimeout> | null = null
const debounceSave = () => {
  if (timer) clearTimeout(timer)
  timer = setTimeout(() => saveRemoteConfig(), 1000)
}
const saveRemoteConfig = async () => {
  const serializeColumn = localColumns.value.map((col) => {
    const { visible: _visible, title, ...rest } = col
    const savedTitle = typeof title === 'string' ? title : undefined
    return { ...rest, title: savedTitle }
  })
  const params = {
    appCode: props.appCode,
    tableCode: props.tableCode,
    column: serializeColumn,
    showColumn: localColumns.value
      .filter((item) => item.visible !== false)
      .map((item) => item.colKey),
  }
  try {
    await tableHeaderSave(params)
    console.log('配置已自动保存')
  } catch {
    console.error('保存配置失败')
  }
}
const fetchRemoteConfig = async () => {
  try {
    const res = (await getHeaderColumnList({
      appCode: props.appCode,
      tableCode: props.tableCode,
    })) as { column?: ColControlColumn[]; showColumn?: string[] } | null
    if (res && res.column && res.column.length > 0) {
      combineConfig(res.column, res.showColumn || [])
    } else {
      initLocalData()
    }
  } catch {
    initLocalData()
  }
}
const combineConfig = (remoteColumns: ColControlColumn[], showColumnKeys: string[]) => {
  const optionsMap = new Map(props.options.map((item) => [item.colKey, item]))
  const remoteMiddles = remoteColumns
    .filter((rc) => optionsMap.has(rc.colKey) && isEdit(optionsMap.get(rc.colKey)!))
    .map((rc) => rc.colKey)
  const newMiddles = props.options
    .filter((opt) => isEdit(opt) && !remoteColumns.some((rc) => rc.colKey === opt.colKey))
    .map((opt) => opt.colKey)
  const finalMiddleKeys = [...remoteMiddles, ...newMiddles]
  const systems = props.options.filter(isSystemCol)
  const lefts = props.options.filter(isLeftFixed)
  const rights = props.options.filter(isRightFixed)
  const middles = finalMiddleKeys.map((key) => optionsMap.get(key)!)
  const newLocalColumns = [...systems, ...lefts, ...middles, ...rights].map((col) => ({
    ...col,
    visible:
      showColumnKeys.length > 0 ? showColumnKeys.includes(col.colKey) : col.visible !== false,
  }))
  localColumns.value = newLocalColumns
  const isStrictMatch =
    remoteColumns.length === newLocalColumns.length &&
    remoteColumns.every((rc, i) => rc.colKey === newLocalColumns[i].colKey)
  syncToParent(!isStrictMatch)
}
const initLocalData = () => {
  if (!props.options || props.options.length === 0) return
  localColumns.value = props.options.map((opt) => ({
    ...opt,
    visible: opt.visible !== false,
  }))
  syncToParent(false)
}
const handleReset = () => {
  if (!props.options || props.options.length === 0) return
  localColumns.value = props.options.map((opt) => ({
    ...opt,
    visible: opt.visible !== false,
  }))
  syncToParent(true)
}
watch(
  () => props.options,
  (newOptions) => {
    if (!newOptions || newOptions.length === 0) return
    if (localColumns.value.length > 0) {
      const showKeys = localColumns.value
        .filter((item) => item.visible !== false)
        .map((item) => item.colKey)
      combineConfig(localColumns.value, showKeys)
    } else {
      initLocalData()
    }
  },
  { deep: true }
)
onMounted(() => {
  fetchRemoteConfig()
})
const leftFixedItems = computed(() => localColumns.value.filter(isLeftFixed))
const rightFixedItems = computed(() => localColumns.value.filter(isRightFixed))
const draggableList = computed({
  get: () => localColumns.value.filter(isEdit),
  set: (newList) => {
    const systems = localColumns.value.filter(isSystemCol)
    const lefts = localColumns.value.filter(isLeftFixed)
    const rights = localColumns.value.filter(isRightFixed)
    localColumns.value = [...systems, ...lefts, ...newList, ...rights]
    syncToParent(true)
  },
})
</script>
<style lang="scss">
.cb-col-control {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.cb-col-control-content {
  padding: 8px;
  max-height: 400px;
  overflow-y: auto;
}
.cb-col-control-title {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
  color: var(--td-text-color-3);
}
.cb-col-control-item {
  display: flex;
  align-items: center;
  min-width: 184px !important;
  height: 32px;
  margin-bottom: 8px;
  justify-content: space-between;
  .drag-handle {
    display: flex;
    align-items: center;
    gap: 4px;
    cursor: move;
  }
  .item-label {
    display: flex;
    align-items: center;
    gap: 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  &.no-drag {
    color: var(--td-text-color-disabled);
    .disabled-icon {
      opacity: 0.3;
    }
  }
}
</style>
