/**
 * Cbname 组件属性
 */
export interface CbnameProps {
  /**
   * 自定义样式类名
   * @default ''
   */
  class?: string
  /**
   * 自定义内联样式
   */
  style?: CSSStyleDeclaration
}

/**
 * Cbname 组件事件
 */
export interface CbnameEmits {
  /**
   * 点击时触发
   * @param event 鼠标事件对象
   */
  click: [event: MouseEvent]
}

/**
 * Cbname 组件插槽
 */
export interface CbnameSlots {
  /**
   * 默认内容
   */
  default: () => any
}
