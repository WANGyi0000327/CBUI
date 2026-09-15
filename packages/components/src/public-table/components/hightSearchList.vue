<template>
  <div class="text-[#999999] flex items-center text-[12px]">
    <span>高频筛选：</span>
    <div class="ml-[5px] flex gap-[10px]">
      <div v-for="(item, index) in highSearchList" :key="index">
        <check-tag
          v-model:high-select-rows="highSelectRows"
          :status="item.labelCode"
          :type-list="highSearchList || []"
          @click="handleChange(item)"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="tsx">
import { ref } from 'vue'
import type { HighSearchItem } from '../interface'
import CheckTag from './checkTag.vue'
const props = withDefaults(
  defineProps<{
    highSearchList: Array<HighSearchItem> | undefined
  }>(),
  {
    highSearchList: () => [],
  }
)
const emits = defineEmits(['getHighList'])
const highSelectRows = ref(new Map([]))
const handleChange = (item: HighSearchItem) => {
  if (highSelectRows.value.get(item.labelCode)) {
    highSelectRows.value.delete(item.labelCode)
  } else {
    highSelectRows.value.set(item.labelCode, item)
  }
  emits('getHighList', highSelectRows.value)
}
const handleClearAll = () => {
  highSelectRows.value.clear()
}
defineExpose({
  handleClearAll,
})
</script>
<style lang="scss" scoped></style>
