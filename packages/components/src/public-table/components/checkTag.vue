<template>
  <div>
    <t-check-tag
      v-if="currentType"
      :color="currentType.color"
      :variant="currentType.variant || 'light'"
      class="border-[#F2F4F5]! flex items-center"
      :class="{ 'gap-[5px]!': hasTagIcon }"
      :checked="checked"
      @change="handleChageTag"
    >
      <template #icon>
        <div v-if="hasTagIcon">
          <slot name="tagIcon"></slot>
        </div>
      </template>
      <span v-if="currentType.nodeName">{{ currentType.nodeName }}：</span>
      {{ currentType?.name || currentType?.label || currentType?.labelName }}
    </t-check-tag>
    <span v-else>-</span>
  </div>
</template>
<script setup lang="tsx">
defineOptions({
  name: 'CbStatusTag',
})
import { computed, ref, useSlots, watch } from 'vue'
type tagType = {
  nodeName?: string
  id?: string | number
  name?: string
  color?: string
  label?: string
  value?: boolean | string | number
  variant?: string | 'dark'
  labelCode: string
  labelName: string
  labelId: string
  code?: string
}
const slots = useSlots()
const hasTagIcon = computed(() => {
  return slots.tagIcon !== undefined
})
interface tagProps {
  typeList: Array<tagType>
  status: string | number
}
const props = withDefaults(defineProps<tagProps>(), {
  typeList: () => [] as tagType[],
  status: '',
})
const highSelectRows = defineModel<Map<string | number, unknown>>('highSelectRows')
const checked = ref(false)
watch(
  () => highSelectRows.value,
  () => {
    checked.value = !!highSelectRows.value?.get(props.status)
  },
  {
    deep: true,
  }
)
const currentType = computed(() => {
  return props.typeList.find(
    (item) => item.labelCode === props.status || item.code === props.status
  )
})
const handleChageTag = (checked: boolean, context: unknown) => {
  console.log(checked, context)
}
</script>
<style lang="scss" scoped></style>
