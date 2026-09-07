<template>
  <div
    ref="detectorRef"
    style="
      position: absolute;
      width: 0;
      height: 0;
      overflow: hidden;
      visibility: hidden;
      pointer-events: none;
    "
    aria-hidden="true"
  >
    <slot name="content"></slot>
  </div>
  <t-popup
    v-if="hasVisibleContent"
    :visible="visible"
    placement="bottom"
    v-bind="$attrs"
    :disabled="disabled"
    @overlay-click="handleContextClick"
    @visible-change="handleVisibleChange"
  >
    <t-button
      v-if="type === 'button'"
      theme="default"
      class="more-button"
      :class="triggerClass"
      :disabled="disabled"
      @click="handleOpenMore"
    >
      <span @click="handleTriggleTextClick">
        <slot name="text">{{ text }}</slot>
      </span>
      <cb-icon :name="visible ? 'jaintou_shang' : 'jaintou_xia'"></cb-icon>
    </t-button>
    <cb-icon
      v-if="type === 'icon'"
      name="gengduo_shu"
      class="cursor-pointer text-[var(--td-color-gray-c)]"
      :class="triggerClass"
      @click="handleOpenMore"
    />
    <template #content>
      <div ref="contentWrapperRef" class="content-wrapper">
        <slot name="content"></slot>
      </div>
    </template>
  </t-popup>
</template>
<script lang="ts" setup>
import type { PropType } from 'vue'
import { nextTick, onBeforeUnmount, onMounted, ref, useSlots, watch } from 'vue'
const visible = ref(false)
const emits = defineEmits(['triggle-text-click'])
defineOptions({
  name: 'CbMorePopup',
})
type MoreButtonType = 'button' | 'icon'
defineProps({
  type: {
    type: String as PropType<MoreButtonType>,
    default: 'button',
  },
  text: {
    type: String,
    default: '更多',
  },
  triggerClass: {
    type: String,
  },
  disabled: {
    type: Boolean,
  },
})
const detectorRef = ref<HTMLElement | null>(null)
const hasVisibleContent = ref(false)
const slots = useSlots()
const updateContentStatus = () => {
  if (!detectorRef.value) return
  const elements = Array.from(detectorRef.value.children) as HTMLElement[]
  const validElements = elements.filter((el) => {
    return el.isConnected && getComputedStyle(el).display !== 'none'
  })
  hasVisibleContent.value = validElements.length > 0
}
let observer: MutationObserver | null = null
onMounted(() => {
  updateContentStatus()
  if (detectorRef.value) {
    observer = new MutationObserver(() => {
      updateContentStatus()
    })
    observer.observe(detectorRef.value, {
      childList: true,
      subtree: true,
      attributes: true,
    })
  }
  nextTick(updateContentStatus)
})
const handleTriggleTextClick = (e: Event) => {
  emits('triggle-text-click', {
    e,
    close,
  })
}
watch(
  () => slots.content?.(),
  () => {
    nextTick(updateContentStatus)
  },
  { deep: true }
)
onBeforeUnmount(() => {
  observer?.disconnect()
})
const handleVisibleChange = (val: boolean, context: { trigger: string }) => {
  if (
    context.trigger === 'trigger-element-click' ||
    context.trigger === 'document'
  ) {
    visible.value = val
  }
}
const handleOpenMore = () => {
  visible.value = !visible.value
}
const close = () => {
  visible.value = false
}
const handleContextClick = (context: { e: MouseEvent }) => {
  const triggerClassName = (context.e.target as any)?.className as string
  if (
    triggerClassName.indexOf('t-link') !== -1 ||
    triggerClassName.indexOf('t-button') !== -1
  ) {
    close()
  }
}
defineExpose({ close })
</script>
<style lang="scss" scoped>
.t-button {
  background-color: var(--td-brand-color-10);
  color: var(--td-brand-color);
  :deep(.t-button__text) {
    display: flex;
    align-items: center;
    gap: 2px;
  }
}
:deep(.t-popup__content) {
  padding: 6px 0;
}
.content-wrapper {
  display: flex;
  flex-direction: column;
  padding: 4px;
  text-align: center;
  align-items: center;
  :deep(.t-button) {
    display: flex;
    align-items: center;
    gap: 2px;
    min-width: 72px !important;
    width: 100%;
    height: 28px;
  }
}
</style>
