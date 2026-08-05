/**
 * 输入框尺寸
 */
export type InputSize = 'small' | 'medium' | 'large'

/**
 * 输入框组件属性
 */
export interface InputProps {
  /**
   * 绑定值（v-model）
   * @default ''
   */
  modelValue?: string | number

  /**
   * 输入框尺寸
   * @default 'medium'
   */
  size?: InputSize

  /**
   * 是否禁用
   * @default false
   */
  disabled?: boolean

  /**
   * 是否只读
   * @default false
   */
  readonly?: boolean

  /**
   * 是否显示清除按钮
   * @default false
   */
  clearable?: boolean

  /**
   * 占位文本
   */
  placeholder?: string

  /**
   * 原生 type 属性
   * @default 'text'
   */
  type?: string

  /**
   * 最大输入长度
   */
  maxlength?: number

  /**
   * 输入框前置图标
   */
  prefixIcon?: string

  /**
   * 输入框后置图标
   */
  suffixIcon?: string
}

/**
 * 输入框组件事件
 */
export interface InputEmits {
  /**
   * 输入值变化时触发
   * @param value 最新值
   */
  'update:modelValue': [value: string]

  /**
   * 输入时触发
   * @param value 当前值
   */
  input: [value: string]

  /**
   * 失去焦点时触发
   * @param event 事件对象
   */
  blur: [event: FocusEvent]

  /**
   * 获得焦点时触发
   * @param event 事件对象
   */
  focus: [event: FocusEvent]

  /**
   * 按下回车键时触发
   * @param event 键盘事件对象
   */
  keydown: [event: KeyboardEvent]

  /**
   * 点击清除按钮时触发
   */
  clear: []
}

/**
 * 输入框组件插槽
 */
export interface InputSlots {
  /**
   * 输入框前置内容
   */
  prefix?: () => unknown

  /**
   * 输入框后置内容
   */
  suffix?: () => unknown
}
