<template>
  <div>
    <t-tag
      v-if="currentType && showType === 'tag'"
      :color="dot ? '' : currentType.color"
      :variant="currentType.variant || 'light'"
      class="!border-[#F2F4F5] flex items-center"
      :style="tagStyle"
      :class="{ '!gap-[5px]': hasTagIcon }"
      :size="size"
    >
      <template #icon>
        <div v-if="hasTagIcon">
          <slot name="tagIcon"></slot>
        </div>
      </template>
      <div class="flex gap-[4px] items-center">
        <div v-if="dot" class="dotbox" :style="{backgroundColor:currentType.color}"></div>
        <template v-if="hasContent">
          <slot name="name" :row="currentType"> </slot>
          <slot name="default" :row="currentType"> </slot>
        </template>
        <span v-else>{{ currentType?.name || currentType?.label }}</span>
        <div v-if="hasSufix">
          <slot name="tagSufix"></slot>
        </div>
      </div>
    </t-tag>
    <span v-else-if="currentType && showType === 'text'" :style="{ color: currentType.color, ...tagStyle }" >
      {{ currentType?.name || currentType?.label  || '-'}}
    </span>
    <span v-else>-</span>
  </div>
</template>
<script setup lang="tsx">
defineOptions({
  name: 'CbStatusTag',
})
import { computed, useSlots } from 'vue'
import type { tagType } from './interface'
const slots = useSlots()
const hasTagIcon = computed(() => {
  return slots.tagIcon !== undefined
})
const hasSufix = computed(() => {
  return slots.tagSufix !== undefined
})
const hasContent = computed(() => {
  return slots.name !== undefined || slots.default !== undefined
})
interface tagProps {
  typeList: Array<tagType>
  status: string | number
  tagStyle?: Record<string, any>
  size?: string
  showType?: 'tag' | 'text'
  dot?: boolean
}
const props = withDefaults(defineProps<tagProps>(), {
  typeList: () => [] as tagType[],
  size: 'large',
  showType: 'tag',
  status: '',
  tagStyle: () => ({}),
})
const currentType = computed(() => {
  return props.typeList.find(
    (item) => item.id === props.status || item.value === props.status
  )
})
</script>
<style lang="scss" scoped>
:deep(.t-tag.t-size-l){
  padding: 0 4px !important;
  height: 24px !important;
}
.dotbox{
  width: 6px;
  height: 6px;
  border-radius: 50%;
}
</style>
