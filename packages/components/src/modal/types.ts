/**
 * Modal 组件属性
 */
export interface ModalProps {
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
 * Modal 组件事件
 */
export interface ModalEmits {
  /**
   * 点击时触发
   * @param event 鼠标事件对象
   */
  click: [event: MouseEvent]
}

/**
 * Modal 组件插槽
 */
export interface ModalSlots {
  /**
   * 默认内容
   */
  default: () => unknown
}
