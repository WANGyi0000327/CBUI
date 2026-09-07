<template>
  <div class="grid gap-[8px] h-full" :style="{ gridTemplateColumns: cardGridStyle }">
    <slot></slot>
  </div>
</template>

<script setup lang="tsx">
// —— import 放在 defineOptions 之前（与 Copy.vue 风格一致）——
import { ref, nextTick, onMounted, onUnmounted } from 'vue'

// —— 组件名必须以 Cb 前缀（项目规范，resolver 匹配 / install 注册均依赖此约定）——
defineOptions({
  name: 'CbGridLayout',
})

// —— 与 Copy.vue 相同：独立 interface Props 声明 + withDefaults ——
// （types.ts 中另存一份对外导出类型，双写保持一致）
interface Props {
  /** 外层盒子的元素选择器（用于读取容器宽度计算列数），默认空字符串（不计算） */
  cardContainer?: string
  /** 单个卡片最小宽度（px），决定一排最多显示多少列 */
  minCardWidth?: number
  /** 卡片间距（px） */
  gap?: number
  /** 最小列数（即使容器很窄也至少显示这么多列） */
  minCol?: number
}

const props = withDefaults(defineProps<Props>(), {
  cardContainer: '',
  minCardWidth: 375,
  gap: 8,
  minCol: 3,
})

const cardGridStyle = ref('')

/** 计算卡片网格样式，根据容器宽度与 min-card-width 确定列数与列宽 */
const calculateCardGridStyle = () => {
  if (!props.cardContainer) return
  const container = document.querySelector(props.cardContainer)
  if (!container) {
    return
  }
  const containerWidth = container.clientWidth
  // 如果宽度为0，说明容器还未完全渲染，延迟重试
  if (containerWidth === 0) {
    setTimeout(() => {
      calculateCardGridStyle()
    }, 100)
    return
  }

  // 计算最大能显示的列数，最小列数
  let columns = Math.floor(containerWidth / ((props.minCardWidth ?? 0) + (props.gap ?? 0)))
  columns = Math.max(props.minCol ?? 1, columns)

  // 计算每列的精确宽度，减去间距
  const columnWidth = (containerWidth - (columns - 1) * (props.gap ?? 0)) / columns
  console.log('columnWidth', columnWidth)

  cardGridStyle.value = `repeat(${columns}, minmax(${props.minCardWidth}px, ${columnWidth}px))`
}

/** 监听窗口大小变化，下一 tick 后重新计算网格 */
const handleResize = () => {
  nextTick(() => {
    calculateCardGridStyle()
  })
}

// 组件挂载后初始化
onMounted(() => {
  // 使用 requestAnimationFrame 确保浏览器完成渲染后再计算
  requestAnimationFrame(() => {
    nextTick(() => {
      calculateCardGridStyle()
    })
  })

  // 添加窗口大小变化监听
  window.addEventListener('resize', handleResize)
})

// 组件卸载时移除事件监听
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style lang="scss" scoped></style>
