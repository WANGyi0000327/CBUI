/**
 * 卡片组件属性
 */
export interface CardProps {
  /**
   * 卡片标题
   */
  title?: string

  /**
   * 是否显示边框
   * @default true
   */
  bordered?: boolean

  /**
   * 是否显示阴影
   * @default false
   */
  shadow?: boolean
}

/**
 * 卡片组件事件
 */
export interface CardEmits {
  /**
   * 点击卡片时触发
   * @param event 鼠标事件对象
   */
  click: [event: MouseEvent]
}

/**
 * 卡片组件插槽
 */
export interface CardSlots {
  /**
   * 卡片内容
   */
  default: () => any

  /**
   * 卡片头部
   */
  header: () => any
}
