<template>
  <div class="image-container">
    <!-- 图片展示区域 -->
    <div ref="imageBoxRef" class="image-box">
      <img
        ref="imageRef"
        class="image"
        :src="imgUrl"
        :style="{
          transform: `rotate(${rotateDeg}deg) scale(${scale}) translate(${position.x}px, ${position.y}px)`,
          opacity: `${opacity}`,
          transformOrigin: 'center center',
        }"
        @load="handleImageLoad"
        @error="handleImageError"
        @mousedown="startDrag"
        @mousemove="onDrag"
        @mouseup="endDrag"
        @mouseleave="endDrag"
        @wheel="handleWheel"
      />
    </div>
    <!-- 控制按钮 -->
    <div class="controls">
      <div v-for="s in butArr" :key="s.name" @click="handleButClick(s.name)">
        <t-button
          theme="default"
          variant="base"
          class="p-[8px] mr-[8px] CbButton but_box"
          :style="{
            background: AlphaBgColor(),
            color: 'var(--td-brand-color)',
          }"
        >
          <cb-icon v-if="s.icon" :name="s.icon" color="text-white" class="cursor-pointer"></cb-icon>
          <div>{{ s.name }}</div>
        </t-button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
// AlphaBgColor 原实现位于业务包 @repo/tdesign-ui（库内不存在），落地为库内工具 #/utils/alphaBgColor
import { AlphaBgColor } from '#/utils/alphaBgColor'
import { ref, onMounted, nextTick, watch } from 'vue'
// 定义 Props 类型并接收参数
const props = defineProps<{
  imgUrl: string // 图片地址（必填）
}>()
// 定义按钮类型接口
interface ButtonItem {
  name: '左转' | '右转' | '放大' | '缩小'
  icon: string
  id: number
}
// 响应式状态
const imageBoxRef = ref<HTMLDivElement | null>(null) // 图片容器 DOM 引用
const imageRef = ref<HTMLImageElement | null>(null) // 图片 DOM 引用
const scale = ref(1) // 缩放比例
const rotateDeg = ref(0) // 旋转角度
const position = ref({ x: 0, y: 0 }) // 图片偏移位置
const isDragging = ref(false) // 是否正在拖拽
const startPos = ref({ x: 0, y: 0 }) // 拖拽起始鼠标位置
const startImagePos = ref({ x: 0, y: 0 }) // 拖拽起始图片位置
const opacity = ref(0) // 图片透明度
const butname = ref<ButtonItem['name'] | null>(null) // 当前选中按钮名称
const isImageLoaded = ref(false) // 图片是否加载完成
// 控制按钮数据
const butArr: ButtonItem[] = [
  { name: '左转', icon: 'zuoxuanzhuan1', id: 1 },
  { name: '右转', icon: 'zuoxuanzhuan', id: 2 },
  { name: '放大', icon: 'fangda', id: 3 },
  { name: '缩小', icon: 'suoxiao', id: 4 },
]
// 监听旋转/缩放变化，自动重新居中
// watch([rotateDeg, scale], () => {
//   if (isImageLoaded.value) {
//     centerImage()
//   }
// })
// 组件挂载后初始化（兼容初始无 imgUrl 场景）
onMounted(() => {
  nextTick(() => {
    if (props.imgUrl && imageRef.value) {
      imageRef.value.src = props.imgUrl // 触发 load 事件
    }
  })
})
/**
 * 重置图片状态
 */
const resetImageState = () => {
  opacity.value = 0
  scale.value = 1
  position.value = { x: 0, y: 0 }
  startPos.value = { x: 0, y: 0 }
  startImagePos.value = { x: 0, y: 0 }
  rotateDeg.value = 0
  butname.value = null
  isImageLoaded.value = false
  // 重新触发图片加载（确保 load 事件执行）
  if (imageRef.value) {
    imageRef.value.src = '' // 先清空 src 避免缓存导致不触发 load
    nextTick(() => {
      imageRef.value?.setAttribute('src', props.imgUrl)
    })
  }
}
/**
 * 图片加载完成回调
 */
const handleImageLoad = () => {
  isImageLoaded.value = true
  nextTick(() => {
    centerImage() // 加载完成后立即居中
    opacity.value = 1 // 显示图片
  })
}
/**
 * 图片加载失败降级处理
 */
const handleImageError = () => {
  isImageLoaded.value = false
  opacity.value = 0
  console.warn(`图片加载失败：${props.imgUrl}`)
  // 可选：显示默认占位图
  if (imageRef.value) {
    imageRef.value.src = '/default-placeholder.png' // 替换为你的占位图地址
  }
}
/**
 * 核心：精准居中逻辑（适配旋转/缩放）
 */
const centerImage = () => {
  // 利用父容器的 flex 居中，只需要重置位置即可
  position.value = { x: 0, y: 0 }
}
/**
 * 按钮点击事件处理
 */
const handleButClick = (name: ButtonItem['name']) => {
  butname.value = name
  switch (name) {
    case '左转':
      rotateLeft()
      break
    case '右转':
      rotateRight()
      break
    case '放大':
      zoomIn()
      break
    case '缩小':
      zoomOut()
      break
  }
}
/**
 * 左转 90°
 */
const rotateLeft = () => {
  rotateDeg.value = (rotateDeg.value - 90) % 360
}
/**
 * 右转 90°
 */
const rotateRight = () => {
  rotateDeg.value = (rotateDeg.value + 90) % 360
}
/**
 * 放大图片
 */
const zoomIn = () => {
  scale.value = Math.min(5, scale.value + 0.1) // 最大缩放 5 倍
}
/**
 * 缩小图片
 */
const zoomOut = () => {
  scale.value = Math.max(0.1, scale.value - 0.1) // 最小缩放 0.1 倍
}
/**
 * 鼠标滚轮缩放
 */
const handleWheel = (e: WheelEvent) => {
  e.preventDefault() // 阻止页面滚动
  const delta = e.deltaY > 0 ? -0.1 : 0.1 // 向下滚缩小，向上滚放大
  scale.value = Math.min(Math.max(0.1, scale.value + delta), 5) // 缩放范围 0.1~5
}
/**
 * 开始拖拽
 */
const startDrag = (e: MouseEvent) => {
  isDragging.value = true
  startPos.value = { x: e.clientX, y: e.clientY }
  startImagePos.value = { ...position.value } // 保存初始位置
  e.preventDefault() // 防止选中文本
}
/**
 * 拖拽中
 */
const onDrag = (e: MouseEvent) => {
  if (!isDragging.value) return
  const dx = e.clientX - startPos.value.x
  const dy = e.clientY - startPos.value.y
  // 基于初始位置计算新位置（避免偏移累积）
  position.value = {
    x: startImagePos.value.x + dx,
    y: startImagePos.value.y + dy,
  }
}
/**
 * 结束拖拽
 */
const endDrag = () => {
  isDragging.value = false
}
// 监听图片地址变化，重置状态
watch(
  () => props.imgUrl,
  () => {
    resetImageState()
  },
  { immediate: true } // 初始执行一次（覆盖 mounted 逻辑）
)
</script>
<style lang="scss" scoped>
.image {
  opacity: 0;
  transition: opacity 0.3s ease; // 平滑显示过渡
}
.image-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  position: relative;
}
.image-box {
  width: 100%;
  height: 100%;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
}
.image-box img {
  max-width: 100%;
  max-height: 100%;
  cursor: grab;
  transition: transform 0.2s ease;
  user-select: none;
  object-fit: contain;
}
.image-box img:active {
  cursor: grabbing;
}
.controls {
  display: flex;
  gap: 10px;
  height: 40px;
  align-items: center;
  position: absolute;
  bottom: 0px;
  z-index: 100;
  .but_box {
    height: 26px;
    display: flex;
    color: #ffffff;
    :deep(.t-button__text) {
      display: flex;
      align-items: center;
      gap: 4px;
    }
  }
  .color {
    background: #268aff;
    color: #fff;
  }
}
.hen-menu-svg {
  width: 22px;
  height: 22px;
  background: #ffffff;
  margin-right: 4px; // 图标与文字间距
}
</style>
