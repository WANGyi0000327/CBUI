<template>
  <div class="base-layout flex flex-col gap-[16px] h-[100%] p-[16px] w-[100%]">
    <div v-if="$slots.header" class="base-layout-header flex justify-between flex-wrap gap-[8px]">
      <slot name="header"></slot>
    </div>
    <div ref="contentRef" class="base-layout-content flex-1 min-h-0">
      <div class="h-full w-full">
        <slot name="content"></slot>
      </div>
    </div>
    <div v-if="$slots.footer" class="base-layout-footer flex justify-end">
      <slot name="footer"></slot>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useResizeObserver, useElementVisibility } from '@vueuse/core'
import type { CbPageLayoutInstance } from './index'
defineOptions({
  name: 'CbPageLayout',
})
const contentRef = ref<HTMLElement>()
const contentHeight = ref(0)
const isContentVisible = useElementVisibility(contentRef)
useResizeObserver(contentRef, (entries) => {
  const entry = entries[0]
  if (entry) {
    contentHeight.value = Math.round(entry.contentRect.height)
  }
})
// 计算属性
const exposedContentHeight = computed(() => {
  if (!isContentVisible.value) {
    return 0
  }
  return contentHeight.value > 10 ? contentHeight.value : 100
})
// 暴露给父组件的实例
defineExpose<CbPageLayoutInstance>({
  contentHeight: exposedContentHeight,
})
</script>
<style lang="scss" scoped>
.base-layout {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  .base-layout-content {
    flex: 1;
    min-height: 0;
    min-width: 0;
    & > div {
      height: 100%;
      width: 100%;
    }
  }
}
</style>
