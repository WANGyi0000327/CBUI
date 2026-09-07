/**
 * GridLayout 网格布局组件类型
 * ----------------------------------------------------------------
 * 根据外层容器宽度自动计算列数，实现响应式卡片网格
 */

/**
 * GridLayout 网格布局组件属性
 */
export interface GridLayoutProps {
  /**
   * 外层盒子的元素选择器（用于读取容器宽度计算列数）
   * @default ''
   */
  cardContainer?: string
  /**
   * 单个卡片最小宽度（px），决定一排最多显示多少列
   * @default 375
   */
  minCardWidth?: number
  /**
   * 卡片间距（px）
   * @default 8
   */
  gap?: number
  /**
   * 最小列数（即使容器很窄也至少显示这么多列）
   * @default 3
   */
  minCol?: number
}
