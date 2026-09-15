<template>
  <div
    ref="wrapRef"
    class="cb-collapse-sidebar"
    :class="[
      `side-${side}`,
      `theme-${theme}`,
      {
        'cb-collapse-sidebar__close': visible,
        dragging: isDragging,
      },
    ]"
  >
    <!-- 修改：content 自适应外层宽度 -->
    <div class="cb-collapse-content">
      <slot></slot>
    </div>
    <!-- 仅开启拖拽+未收起显示分割线 -->
    <div
      v-if="resizable && !visible"
      class="resize-drag-bar"
      :class="{ dragging: isDragging }"
      @mousedown="handleDragStart"
    />
    <!-- 原有折叠按钮完全保留 -->
    <div
      class="cb-collapse-sidebar-btn"
      :class="visible ? 'btn-right' : 'btn-left'"
      @click="handleToggle"
    >
      <cb-icon :name="side === 'right' ? 'sanjiaojiantou_zuo' : 'sanjiaojiantou_you'" />
    </div>
  </div>
</template>
<script setup lang="ts">
defineOptions({
  name: 'CbCollapseSidebar',
})
import { ref, onUnmounted, onMounted, watch } from 'vue'
interface Props {
  side?: 'left' | 'right'
  theme?: 'light' | 'brand'
  resizable?: boolean
  initWidth?: number
  minWidth?: number
  maxWidth?: number
}
const props = withDefaults(defineProps<Props>(), {
  side: 'left',
  theme: 'light',
  resizable: false,
  initWidth: 274,
  minWidth: 200,
  maxWidth: 600,
})
const sidebarWidth = defineModel<number>('width')
const visible = ref(false)
const wrapRef = ref<HTMLDivElement | null>(null)
const isDragging = ref(false)
let startX = 0
let startDomWidth = 0
const handleToggle = () => {
  if (props.resizable) {
    sidebarWidth.value = !visible.value ? 0 : props.initWidth
  }
  visible.value = !visible.value
}
const handleDragStart = (e: MouseEvent) => {
  e.preventDefault()
  isDragging.value = true
  startX = e.clientX
  startDomWidth = wrapRef.value!.offsetWidth
  document.addEventListener('mousemove', handleDragMove, { passive: false })
  document.addEventListener('mouseup', handleDragEnd)
}
const handleDragMove = (e: MouseEvent) => {
  if (!wrapRef.value) return
  const offsetX = e.clientX - startX
  // 两侧统一"向右拖变宽、向左拖变窄"（面板跟手直觉）
  // 注：原公式 side=right 用 startDomWidth - offsetX 导致右栏拖拽方向相反，已修复
  let newW = startDomWidth + offsetX
  newW = Math.max(props.minWidth, Math.min(props.maxWidth, newW))
  wrapRef.value.style.width = `${newW}px`
}
const handleDragEnd = () => {
  if (!wrapRef.value) return
  isDragging.value = false
  const finalW = wrapRef.value.offsetWidth
  sidebarWidth.value = finalW
  document.removeEventListener('mousemove', handleDragMove)
  document.removeEventListener('mouseup', handleDragEnd)
}
watch(sidebarWidth, (val) => {
  if (!isDragging.value && props.resizable && wrapRef.value) {
    wrapRef.value.style.width = `${val}px`
  }
})
onMounted(() => {
  if (!wrapRef.value) return
  if (props.resizable) {
    if (sidebarWidth.value == null) {
      sidebarWidth.value = props.initWidth
    }
    wrapRef.value.style.width = `${sidebarWidth.value}px`
  }
})
onUnmounted(() => {
  document.removeEventListener('mousemove', handleDragMove)
  document.removeEventListener('mouseup', handleDragEnd)
})
</script>
<style lang="scss" scoped>
$transition-time: 0.3s;
$btn-width: 14px;
$btn-height: 45px;
$border-color: #e6e6e6;
.cb-collapse-sidebar {
  height: 100%;
  position: relative;
  display: flex;
  transition:
    width $transition-time cubic-bezier(0.4, 0, 0.2, 1),
    margin $transition-time cubic-bezier(0.4, 0, 0.2, 1);
  &.dragging {
    transition: none !important;
    user-select: none;
  }
  &.cb-collapse-sidebar__close {
    width: 0;
    .cb-collapse-sidebar-btn {
      transform: translateY(-50%) rotateY(0deg);
    }
    // 收起时按钮贴回组件边缘内侧，避免溢出外层 overflow:hidden 容器被裁切导致点不到
    // side=left（组件在容器左侧）→ 按钮贴右缘向右伸；side=right（组件在容器右侧）→ 按钮贴左缘向左伸
    &.side-left .cb-collapse-sidebar-btn {
      left: 0 !important;
      right: auto !important;
    }
    &.side-right .cb-collapse-sidebar-btn {
      left: auto !important;
      right: 0 !important;
    }
  }
  &.theme-brand {
    .cb-collapse-sidebar-btn {
      background: var(--td-brand-color);
      color: #fff;
      border: transparent;
    }
  }
  /* 核心修复：删除 width:100%，使用 flex 自适应 */
  .cb-collapse-content {
    flex: 1;
    height: 100%;
    overflow: hidden;
    // padding: 0 12px;
    display: flex;
    justify-content: center;
    min-width: 0; /* 允许内部子元素压缩 */
  }
  .cb-collapse-sidebar-btn {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    top: 50%;
    transform: translateY(-50%) rotateY(-180deg);
    width: $btn-width;
    height: $btn-height;
    border: 1px solid #e6e6e6;
    cursor: pointer;
    background-color: #fff;
    z-index: 9;
  }
  &.side-left {
    border-right: 1px solid $border-color;
    .cb-collapse-sidebar-btn {
      right: -$btn-width;
      border-left: none;
      border-radius: 0 4px 4px 0;
      transform-origin: left center;
    }
    .resize-drag-bar {
      right: 0;
      top: 0;
      height: 100%;
      width: 4px;
    }
    &.cb-collapse-sidebar__close {
      border-right: none;
    }
  }
  &.side-right {
    border-left: 1px solid $border-color;
    .cb-collapse-sidebar-btn {
      left: -$btn-width;
      border-right: none;
      border-radius: 4px 0 0 4px;
      transform-origin: right center;
    }
    .resize-drag-bar {
      left: 0;
      top: 0;
      height: 100%;
      width: 4px;
    }
    &.cb-collapse-sidebar__close {
      border-left: none;
    }
  }
  .resize-drag-bar {
    position: absolute;
    background: var(--td-border-color-1);
    cursor: col-resize;
    z-index: 8;
    transition: background 0.2s ease;
    &:hover,
    &.dragging {
      background: var(--td-brand-color);
    }
  }
}
</style>
