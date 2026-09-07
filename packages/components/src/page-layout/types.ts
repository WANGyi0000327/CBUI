/**
 * PageLayout 页面布局容器组件类型
 * ----------------------------------------------------------------
 * 提供 header / content / footer 三段式布局插槽，
 * content 区域通过 ResizeObserver 实时测量高度并暴露给父组件。
 */
import type { ComputedRef } from 'vue'

/**
 * PageLayout 暴露给父组件（通过 ref）的实例
 */
export interface CbPageLayoutInstance {
  /**
   * content 区域当前高度（px）
   * - 容器不可见时返回 0
   * - 高度 <= 10px 时兜底返回 100
   */
  contentHeight: ComputedRef<number>
}
