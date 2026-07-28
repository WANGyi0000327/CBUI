/**
 * 按钮类型
 */
export type ButtonType = 'primary' | 'default' | 'danger'

/**
 * 按钮尺寸
 */
export type ButtonSize = 'small' | 'medium' | 'large'

/**
 * 按钮原生 HTML 类型
 */
export type ButtonNativeType = 'button' | 'submit' | 'reset'

/**
 * 按钮组件属性
 */
export interface ButtonProps {
  /**
   * 按钮类型
   * @default 'default'
   */
  type?: ButtonType

  /**
   * 按钮尺寸
   * @default 'medium'
   */
  size?: ButtonSize

  /**
   * 是否禁用
   * @default false
   */
  disabled?: boolean

  /**
   * 是否加载中
   * @default false
   */
  loading?: boolean

  /**
   * 原生 button 类型
   * @default 'button'
   */
  nativeType?: ButtonNativeType

  /**
   * 是否为块级元素（占满父容器宽度）
   * @default false
   */
  block?: boolean
}

/**
 * 按钮组件事件
 */
export interface ButtonEmits {
  /**
   * 点击按钮时触发
   * @param event 鼠标事件对象
   */
  click: [event: MouseEvent]
}

/**
 * 按钮组件插槽
 */
export interface ButtonSlots {
  /**
   * 按钮内容
   */
  default: () => any
}
