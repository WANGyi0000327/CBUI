/**
 * Icon 图标组件属性
 */
export interface IconProps {
  /**
   * 图标名称（iconfont 中的名字，不含 icon- 前缀）
   * @required
   */
  name: string

  /**
   * 图标大小（CSS font-size 值，如 '16px'、'1em'）
   */
  size?: string

  /**
   * 图标颜色（CSS 颜色值）
   */
  color?: string
}
