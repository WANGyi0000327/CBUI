<template>
  <t-select
    v-model="checked"
    :keys="keys"
    :options="list"
    clearable
    v-bind="$attrs"
    multiple
  >
    <template #panelTopContent>
      <div
        v-if="list && list.length > 0"
        :style="{ position: 'sticky', top: '0', zIndex: 1 }"
        class="cb-multiple-checkedAll"
      >
        <t-checkbox
          :checked="checkedAll"
          :indeterminate="indeterminate"
          @change="handleToggleAll"
        >
          全选
        </t-checkbox>
      </div>
    </template>
  </t-select>
</template>
<script lang="ts" setup generic="T extends Record<string, any>">
import { computed } from 'vue'
import type { KeysType } from 'tdesign-vue-next'
const checked = defineModel<Array<string | number>>({ default: () => [] })
defineOptions({
  name: 'CbMultipleSelect',
})
const props = defineProps<{
  list?: T[]
  keys?: KeysType
}>()
const defaultKeys = {
  value: 'value',
  label: 'label',
  disabled: 'disabled',
}
const innerKeys = computed(() => ({
  ...defaultKeys,
  ...props.keys,
}))
const selectableValues = computed(() => {
  if (!props.list) return []
  const vKey = innerKeys.value.value as keyof T
  const dKey = innerKeys.value.disabled as keyof T
  return props.list
    .filter((item) => !item[dKey])
    .map((item) => item[vKey] as string | number)
})
const checkedAll = computed(() => {
  return (
    selectableValues.value.length > 0 &&
    selectableValues.value.every((v) => checked.value.includes(v))
  )
})
const indeterminate = computed(() => {
  return (
    !checkedAll.value &&
    checked.value.length > 0 &&
    selectableValues.value.some((v) => checked.value.includes(v))
  )
})
const handleToggleAll = (val: boolean) => {
  console.log(999, selectableValues.value, 'selectableValues.value')
  if (val) {
    checked.value = [...selectableValues.value]
  } else {
    checked.value = []
  }
}
defineExpose({ handleToggleAll })
</script>
<style lang="scss" scoped>
.cb-multiple-checkedAll {
  padding: 6px 14px 0 14px;
  border-bottom: 1px solid var(--td-border-color-1_5);
  background: #fff;
  :deep(.t-checkbox) {
    width: 100%;
  }
}
</style>
