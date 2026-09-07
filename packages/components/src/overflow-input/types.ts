/**
 * OverflowInput 溢出省略输入框组件类型
 * ----------------------------------------------------------------
 * 用于展示一组长文本列表：超出 max 项时省略，并追加"等 N 个"计数后缀。
 * 视觉上复用 t-input 的边框 / 禁用底色等设计令牌。
 */

/**
 * OverflowInput 溢出省略输入框组件属性
 */
export interface OverflowInputProps {
  /**
   * 最多展示的项数，超出部分折叠为计数后缀
   * @default 5
   */
  max?: number
  /**
   * 文本项列表
   * @default []
   */
  data?: string[]
  /**
   * 计数后缀单位（如"个""家""款"）
   */
  unit?: string
  /**
   * 项与项之间的分隔符
   * @default '/'
   */
  delimiter?: string
}
