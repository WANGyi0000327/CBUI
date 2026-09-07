import type { TNode } from 'tdesign-vue-next'

/** 以下类型仅保留兼容入口导出，业务属性以组件内部 defineProps 为准 */

export type ButtonType = 'primary' | 'default' | 'danger'
export type ButtonSize = 'small' | 'medium' | 'large'
export type ButtonNativeType = 'button' | 'submit' | 'reset'

/** TDesign 按钮主题 */
export type ButtonTheme = 'default' | 'primary' | 'danger' | 'warning' | 'success'
/** CB UI 自定义按钮主题 + TDesign 原生主题 */
export type CustomButtonTheme = ButtonTheme | 'cb-brand-default' | 'cb-brand-gray'

/**
 * 按钮组件属性（以 defineProps 中实际定义为准）
 */
export interface ButtonProps {
  /**
   * 按钮主题
   * @default 'primary'
   */
  theme?: CustomButtonTheme
  /**
   * 按钮图标（字符串 = CbIcon 名称；TNode = 自定义渲染函数）
   */
  icon?: string | TNode
  /**
   * 兼容旧 API 的 type 双通道：
   * - 主题色值（primary/default/warning/success/danger/cb-brand-*）→ 自动映射为 theme，优先级高于 theme
   * - 原生按钮类型（button/submit/reset）→ 原样透传给 <t-button>
   */
  type?: string
}

export interface ButtonEmits {
  click: [event: MouseEvent]
}

export interface ButtonSlots {
  default: () => unknown
}
