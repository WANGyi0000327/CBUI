/**
 * DatePicker 组件属性
 */
export interface DatePickerProps {
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
 * DatePicker 组件事件
 */
export interface DatePickerEmits {
  /**
   * 点击时触发
   * @param event 鼠标事件对象
   */
  click: [event: MouseEvent]
}

/**
 * DatePicker 组件插槽
 */
export interface DatePickerSlots {
  /**
   * 默认内容
   */
  default: () => unknown
}
