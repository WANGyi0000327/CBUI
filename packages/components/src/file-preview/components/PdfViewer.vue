<template>
  <div id="alice" class="pdf-viewer-container">
    <t-loading attach="#alice" size="26px" :loading="isLoading"></t-loading>
    <div class="pagenumber">
      <div class="pagenumber_box">{{ currentPage }} / {{ numPages }}</div>
    </div>
    <!-- PDF 画布容器 -->
    <div class="content-wrapper">
      <!-- 缩略图侧边栏 -->
      <div v-show="showThumbnails" ref="thumbnailSidebar" class="thumbnail-sidebar">
        <div ref="thumbnailList" class="thumbnail-list">
          <div
            v-for="(_page, index) in numPages"
            :key="index"
            :ref="(el) => (thumbnailRefs[index] = el as HTMLElement | null)"
            @click="goToPage(index + 1)"
          >
            <div :class="{ active: currentPage === index + 1 }" class="thumbnail-item">
              <canvas
                :ref="(el) => (thumbCanvasRefs[index] = el as HTMLCanvasElement | null)"
                class="thumbnail-canvas"
              ></canvas>
              <div class="page-number">{{ index + 1 }}</div>
            </div>
          </div>
        </div>
      </div>
      <!-- 主PDF查看区域 -->
      <div ref="mainContent" class="main-content" @scroll="handleMainScroll">
        <div class="pdf-view-area">
          <div class="multi-page-view">
            <div
              v-for="(_page, index) in numPages"
              :key="index"
              :ref="(el) => (pageRefs[index] = el as HTMLElement | null)"
              class="page-container"
              :style="{
                transform: `rotate(${rotate}deg)`,
                marginTop: isPortraitOrientation(rotate),
              }"
            >
              <canvas :ref="(el) => (pageCanvasRefs[index] = el as HTMLCanvasElement | null)" class="pdf-canvas"></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 工具栏 -->
    <div class="toolbar">
      <div class="controls">
        <div v-for="s in but_arr" :key="s.name" @click="butfun(s.name)">
          <t-button
            theme="default"
            variant="base"
            class="w-[72px] CbButton but_box"
            :style="{
              background: AlphaBgColor(),
              color: 'var(--td-brand-color)',
            }"
          >
            <cb-icon
              v-if="s.icon"
              :name="s.icon"
              color="text-white"
              class="cursor-pointer"
            ></cb-icon>
            <div>{{ s.name }}</div>
          </t-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
// AlphaBgColor 原实现位于业务包 @repo/tdesign-ui（库内不存在），落地为库内工具 #/utils/alphaBgColor
import { AlphaBgColor } from '#/utils/alphaBgColor'
import { ref, watch, nextTick, onMounted, onBeforeUnmount, shallowRef } from 'vue'
import * as pdfjsLib from 'pdfjs-dist'
// 原源码为 import * as pdfjsLib from 'pdfjs-dist/build/pdf'：
// pdfjs-dist@3.x 的类型声明在主入口（package.json types: types/src/pdf.d.ts），
// build/pdf 路径无 .d.ts 会报 TS7016；运行时两者解析同一文件（main: build/pdf.js）
import 'pdfjs-dist/build/pdf.worker.entry'
defineOptions({
  name: 'CbPdfViewer',
})
// 类型定义
interface ButtonItem {
  name: '缩小' | '放大' | '旋转' | '重置'
  icon?: string
}
interface Props {
  pdfUrl: string
}
// 定义Props
const props = withDefaults(defineProps<Props>(), {
  pdfUrl: '',
})
// 响应式状态
let pdfDoc: pdfjsLib.PDFDocumentProxy | null = null
const currentPage = ref(1)
const numPages = ref(0)
const scale = ref(1)
const rotate = ref(0)
const isLoading = ref(false)
const showThumbnails = ref(true)
const thumbnailScale = ref(0.1)
const firstPageWidth = ref(0)
const firstPageHeight = ref(0)
const firstPageOrientation = ref<'1' | '2'>('2') // 1:横向 2:纵向
const butname = ref<ButtonItem['name'] | null>(null)
const scrollDebounceTimer = ref()
// SSR 安全：build:docs 服务端渲染时 window 不存在（原源码直接取 window.devicePixelRatio）
const devicePixelRatio = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1
// 元素引用（替代Vue2的$refs）
const mainContent = ref<HTMLDivElement | null>(null)
const thumbnailSidebar = ref<HTMLDivElement | null>(null)
const thumbnailList = ref<HTMLDivElement | null>(null)
const pageRefs = ref<Array<HTMLElement | null>>([]) // 页面容器引用
const thumbnailRefs = ref<Array<HTMLElement | null>>([]) // 缩略图容器引用
const pageCanvasRefs = ref<Array<HTMLCanvasElement | null>>([]) // 页面画布引用
const thumbCanvasRefs = ref<Array<HTMLCanvasElement | null>>([]) // 缩略图画布引用
// 渲染任务跟踪（pdf.js RenderTask 的结构化子集）
const pageRenderTasks = shallowRef<Record<string, { cancel: () => void }>>({})
// 按钮配置
const but_arr = ref<ButtonItem[]>([
  { name: '缩小', icon: 'suoxiao' },
  { name: '放大', icon: 'fangda' },
  { name: '旋转', icon: 'zuoxuanzhuan' },
  { name: '重置', icon: '' },
])
// 监听currentPage变化，确保缩略图可见
watch(currentPage, (newPage, oldPage) => {
  if (newPage !== oldPage) {
    ensureThumbnailVisible(newPage)
    nextTick(() => {
      scrollToActiveThumbnail(newPage)
    })
  }
})
// 监听showThumbnails变化，生成缩略图
watch(showThumbnails, () => {
  nextTick(() => {
    if (showThumbnails.value && pdfDoc) {
      generateThumbnails()
    }
  })
})
// 生命周期：挂载时初始化
onMounted(() => {
  // 初始化引用数组长度
  nextTick(() => {
    if (numPages.value > 0) {
      pageRefs.value = Array(numPages.value).fill(null)
      thumbnailRefs.value = Array(numPages.value).fill(null)
      pageCanvasRefs.value = Array(numPages.value).fill(null)
      thumbCanvasRefs.value = Array(numPages.value).fill(null)
    }
  })
})
// 生命周期：卸载前清理
onBeforeUnmount(() => {
  // 清理所有渲染任务
  if (Object.keys(pageRenderTasks.value).length > 0)
    Object.values(pageRenderTasks.value).forEach((task) => {
      task?.cancel()
    })
  // 清理防抖计时器
  if (scrollDebounceTimer.value) {
    clearTimeout(scrollDebounceTimer.value)
  }
})
// 加载PDF文件
const loadPdf = async (url: string) => {
  isLoading.value = true
  try {
    const loadingTask = pdfjsLib.getDocument({
      url,
      cMapUrl: 'https://unpkg.com/pdfjs-dist@3.11.174/cmaps/',
      cMapPacked: true,
      useWorkerFetch: true,
    })
    pdfDoc = await loadingTask.promise
    numPages.value = pdfDoc.numPages
    currentPage.value = 1
    // // 初始化引用数组
    // pageRefs.value = Array(numPages.value).fill(null);
    // thumbnailRefs.value = Array(numPages.value).fill(null);
    // pageCanvasRefs.value = Array(numPages.value).fill(null);
    // thumbCanvasRefs.value = Array(numPages.value).fill(null);
    // 获取第一页信息，判断 orientation
    if (numPages.value > 0) {
      const firstPage = await pdfDoc.getPage(1)
      const viewport = firstPage.getViewport({ scale: 1.0 })
      firstPageWidth.value = viewport.width
      firstPageHeight.value = viewport.height
      firstPageOrientation.value = viewport.width > viewport.height ? '1' : '2'
      // 计算初始缩放比例，使PDF撑满容器
      await calculateInitialScale(viewport)
    }
    // 先渲染所有页面
    await renderAllPages()
    // 生成缩略图
    nextTick(() => {
      if (showThumbnails.value) {
        generateThumbnails()
      }
    })
  } catch (error) {
    console.error('PDF 加载失败:', error)
  } finally {
    isLoading.value = false
    nextTick(() => {
      renderAllPages()
    })
  }
}
// 计算初始缩放比例，使PDF撑满容器
const calculateInitialScale = async (viewport: pdfjsLib.PageViewport) => {
  if (!mainContent.value) return
  // 等待DOM更新
  await nextTick()
  const containerWidth = mainContent.value.clientWidth
  const padding = 40 // 左右padding
  const availableWidth = containerWidth - padding * 2
  // 计算缩放比例，使PDF宽度适应容器
  const newScale = availableWidth / viewport.width
  // 限制缩放范围
  scale.value = Math.max(0.5, Math.min(newScale, 2))
}
// 监听pdfUrl变化，重新加载PDF
watch(
  () => props.pdfUrl,
  (newUrl) => {
    if (newUrl) {
      currentPage.value = 1
      scale.value = 1
      butname.value = null
      loadPdf(newUrl)
    }
  },
  { immediate: true }
)
// 放大
const zoomIn = async () => {
  if (scale.value < 2) {
    scale.value += 0.1
    // 重新渲染所有页面以应用新的缩放比例
    await renderAllPages()
  }
}
// 缩小
const zoomOut = async () => {
  if (scale.value > 0.5) {
    scale.value -= 0.1
    // 重新渲染所有页面以应用新的缩放比例
    await renderAllPages()
  }
}
// 按钮点击事件
const butfun = async (name: ButtonItem['name']) => {
  butname.value = name
  switch (name) {
    case '旋转':
      console.log('🍭-----旋转-----')
      rotate.value += 90
      break
    case '放大':
      await zoomIn()
      break
    case '缩小':
      await zoomOut()
      break
    case '重置':
      scale.value = 1
      rotate.value = 0
      // 重新渲染所有页面以应用重置后的缩放比例
      await renderAllPages()
      break
  }
}
// 渲染单页PDF
const renderPage = async (pageNum: number) => {
  if (!pdfDoc || isLoading.value || pageNum < 1 || pageNum > numPages.value) return
  // 取消该页面现有渲染任务
  if (pageRenderTasks.value[pageNum]) {
    pageRenderTasks.value[pageNum]?.cancel()
  }
  try {
    const page = await pdfDoc.getPage(pageNum)
    // 根据当前缩放比例和设备像素比计算实际渲染比例
    const actualScale = scale.value * devicePixelRatio
    const viewport = page.getViewport({ scale: actualScale })
    const canvas = pageCanvasRefs.value[pageNum - 1]
    if (!canvas) return
    // 设置画布尺寸（考虑设备像素比）
    canvas.width = viewport.width
    canvas.height = viewport.height
    // 设置CSS显示尺寸
    const displayWidth = viewport.width / devicePixelRatio
    const displayHeight = viewport.height / devicePixelRatio
    canvas.style.width = `${displayWidth}px`
    canvas.style.height = `${displayHeight}px`
    const context = canvas.getContext('2d')
    if (!context) return
    // 执行渲染
    const renderTask = page.render({
      canvasContext: context,
      viewport: viewport,
    })
    pageRenderTasks.value[pageNum] = renderTask
    await renderTask.promise
    delete pageRenderTasks.value[pageNum]
  } catch (error) {
    if ((error as Error).name !== 'RenderingCancelledException') {
      console.error(`渲染第 ${pageNum} 页失败:`, error)
    }
  }
}
// 渲染所有页面（限制并发）
const renderAllPages = async () => {
  if (!pdfDoc || isLoading.value) return
  const concurrency = 3 // 最大并发数
  const queue = [...Array(numPages.value).keys()].map((i) => i + 1)
  const renderBatch = async () => {
    while (queue.length > 0) {
      const batch = queue.splice(0, concurrency)
      await Promise.all(batch.map((pageNum) => renderPage(pageNum)))
    }
  }
  await renderBatch()
}
// 生成缩略图（顺序渲染，避免卡顿）
const generateThumbnails = async () => {
  if (!pdfDoc || !showThumbnails.value) return
  const renderThumbnail = async (pageNum: number) => {
    return new Promise<void>((resolve) => {
      requestAnimationFrame(async () => {
        try {
          const page = await pdfDoc!.getPage(pageNum)
          // 缩略图也考虑设备像素比，保持清晰度
          const actualScale = thumbnailScale.value * devicePixelRatio
          const viewport = page.getViewport({ scale: actualScale })
          const canvas = thumbCanvasRefs.value[pageNum - 1]
          if (canvas) {
            const context = canvas.getContext('2d')
            if (!context) return resolve()
            canvas.width = viewport.width
            canvas.height = viewport.height
            // 设置CSS显示尺寸
            const displayWidth = viewport.width / devicePixelRatio
            const displayHeight = viewport.height / devicePixelRatio
            canvas.style.width = `${displayWidth}px`
            canvas.style.height = `${displayHeight}px`
            await page.render({
              canvasContext: context,
              viewport: viewport,
            }).promise
          }
        } catch (error) {
          console.error(`生成第${pageNum}页缩略图失败:`, error)
        } finally {
          resolve()
        }
      })
    })
  }
  // 顺序渲染所有缩略图
  for (let i = 1; i <= numPages.value; i++) {
    await renderThumbnail(i)
  }
}
// 跳转到指定页面
const goToPage = (pageNum: number) => {
  if (pageNum >= 1 && pageNum <= numPages.value) {
    currentPage.value = pageNum
    scrollToPage(pageNum)
  }
}
// 滚动到指定页面
const scrollToPage = (pageNum: number) => {
  if (!mainContent.value) return
  const pageIndex = pageNum - 1
  const pageEl = pageRefs.value[pageIndex]
  if (pageEl) {
    pageEl.scrollIntoView({ behavior: 'smooth' })
  }
}
// 滚动事件处理（防抖）
const handleMainScroll = () => {
  if (!mainContent.value) return
  if (scrollDebounceTimer.value) {
    clearTimeout(scrollDebounceTimer.value)
  }
  scrollDebounceTimer.value = setTimeout(() => {
    updateCurrentPageFromScroll()
  }, 100)
}
// 根据滚动位置更新当前页
const updateCurrentPageFromScroll = () => {
  if (!mainContent.value) return
  const container = mainContent.value
  const containerRect = container.getBoundingClientRect()
  let closestPage = 1
  let minDistance = Infinity
  // 查找最接近视口中心的页面
  pageRefs.value.forEach((pageEl: HTMLElement | null, index: number) => {
    if (!pageEl) return
    const rect = pageEl.getBoundingClientRect()
    const pageCenter = rect.top + rect.height / 2
    const containerCenter = containerRect.top + containerRect.height / 2
    const distance = Math.abs(pageCenter - containerCenter)
    if (distance < minDistance) {
      minDistance = distance
      closestPage = index + 1
    }
  })
  if (closestPage !== currentPage.value) {
    currentPage.value = closestPage
  }
}
// 确保当前页缩略图可见
const ensureThumbnailVisible = (pageNum: number) => {
  if (!showThumbnails.value || !thumbnailSidebar.value || !thumbnailList.value) return
  const thumbnailIndex = pageNum - 1
  const thumbnailEl = thumbnailRefs.value[thumbnailIndex]
  if (!thumbnailEl) return
  const sidebarRect = thumbnailSidebar.value.getBoundingClientRect()
  const thumbnailRect = thumbnailEl.getBoundingClientRect()
  // 缩略图不在可视区域时滚动
  if (thumbnailRect.top < sidebarRect.top || thumbnailRect.bottom > sidebarRect.bottom) {
    const listRect = thumbnailList.value.getBoundingClientRect()
    const relativeTop = thumbnailRect.top - listRect.top
    thumbnailList.value.scrollTop =
      thumbnailList.value.scrollTop + relativeTop - sidebarRect.height / 2 + thumbnailRect.height / 2
  }
}
// 滚动到当前激活的缩略图
const scrollToActiveThumbnail = (pageNum: number) => {
  const index = pageNum - 1
  const thumbnailEl = thumbnailRefs.value[index]
  if (thumbnailEl) {
    thumbnailEl.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
    })
  }
}
// 判断旋转后的marginTop
const isPortraitOrientation = (rotateDeg: number): string => {
  const normalizedDeg = (rotateDeg + 360) % 360
  if ((normalizedDeg === 90 || normalizedDeg === 270) && firstPageOrientation.value === '1') {
    return '320px'
  }
  return '10px'
}
// 暴露方法给父组件（可选）
defineExpose({
  goToPage,
  zoomIn,
  zoomOut,
})
</script>
<style lang="scss" scoped>
.pdf-viewer-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  position: relative;
}
.pagenumber {
  position: absolute;
  // width: 129px;
  top: 0;
  left: 139px;
  z-index: 100;
  .pagenumber_box {
    border-radius: 4px;
    width: 60px;
    height: 28px;
    // background-color: #fff;
    text-align: center;
    line-height: 28px;
    margin: 0 auto;
    color: #666666;
    font-family: 'PingFang SC';
    font-size: 14px;
    font-weight: 400;
  }
}
.toolbar {
  display: flex;
  align-items: center;
  background: #f5f7fa;
  border-radius: 4px;
  flex-wrap: wrap;
  justify-content: center;
  .controls {
    display: flex;
    gap: 10px;
    height: 40px;
    box-sizing: border-box;
    align-items: center;
    position: absolute;
    bottom: 0px;
    z-index: 100;
    .color {
      background: #268aff;
      color: #fff;
    }
    .but_box {
      display: flex;
      height: 26px;
      color: #ffffff;
      :deep(.t-button__text) {
        display: flex;
        align-items: center;
        gap: 4px;
      }
    }
  }
}
.content-wrapper {
  display: flex;
  flex: 1;
  overflow: hidden;
  position: relative;
  min-height: 0;
}
.thumbnail-sidebar {
  width: 140px;
  overflow-y: auto;
  background: #f0f2f5;
  padding: 10px 5px;
  border-right: 1px solid #e6e6e6;
  flex-shrink: 0;
  position: relative;
}
.thumbnail-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 5px 0;
}
.thumbnail-item {
  cursor: pointer;
  border: 2px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  transition: all 0.2s;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
.thumbnail-item:hover {
  border-color: #c0c4cc;
}
.thumbnail-item.active {
  border-color: #409eff;
}
.thumbnail-canvas {
  width: 100%;
  height: auto;
}
.page-number {
  text-align: center;
  font-size: 12px;
  color: #606266;
  padding: 2px 0;
  background: #f8f8f8;
}
.main-content {
  flex: 1;
  display: flex;
  overflow: auto;
  position: relative;
  background: #e8e8e8;
  justify-content: center;
  padding: 20px 0;
}
/* 多页视图样式 */
.multi-page-view {
  padding: 0 20px;
  align-content: start;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}
.page-container {
  background: white;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s;
  break-inside: avoid;
  page-break-inside: avoid;
  margin-bottom: 10px;
  width: fit-content;
}
.pdf-canvas {
  display: block;
  max-width: 100%;
  height: auto;
}
.pdf-canvas-wrapper {
  flex: 1;
  max-width: 100%;
  overflow: auto;
  padding: 10px;
  display: flex;
  justify-content: center;
}
.pdf-canvas-container {
  transform-origin: center center;
  transition: transform 0.3s ease;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 10px;
}
.thumbnail-toggle {
  position: absolute;
  right: 10px;
  bottom: 10px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  z-index: 10;
  transition: all 0.2s;
}
.thumbnail-toggle:hover {
  background: rgba(0, 0, 0, 0.9);
}
.hen-menu-svg {
  width: 22px;
  height: 22px;
  background: #ffffff;
}
/* 样式穿透（适配Vue3） */
::v-deep(.el-loading-mask) {
  z-index: 10000 !important;
}
</style>
