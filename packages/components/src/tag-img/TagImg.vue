<template>
  <div>
    <div v-if="props.status" class="!flex !items-center !gap-[4px]">
      <cb-icon
        :name="currentType?.icon || ''"
        :color="currentType?.color"
        font-size="14px"
      ></cb-icon>
      <span class="title ml-[5px]" :style="{ color: currentType?.textcolor }">
        {{ currentType?.name || currentType?.label }}</span
      >
    </div>
    <div v-else class="!flex !items-center !gap-[4px]">-</div>
  </div>
</template>
<script setup lang="tsx">
defineOptions({
  name: 'CbTagImg',
})
import { computed, watch } from 'vue'
type tagType = {
  id?: string | number
  name?: string
  color?: string
  label?: string
  value?: boolean | string | number
  icon?: string
  textcolor?: string
}
interface tagProps {
  typeList: Array<tagType>
  status: string | number
  variant?: string
}
const props = withDefaults(defineProps<tagProps>(), {
  typeList: () => [] as tagType[],
  status: '',
  variant: '',
})
const currentType = computed(() => {
  return props.typeList.find(
    (item) => item.id === props.status || item.value === props.status
  )
})
watch(
  () => props.status,
  () => {
    console.log('props.status', props.status)
  }
)
</script>
<style lang="scss" scoped>
.title {
  color: #666666;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
}
</style>
