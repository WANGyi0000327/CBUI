/**
 * MorePopup 更多弹层组件类型
 * ----------------------------------------------------------------
 * 基于 TDesign t-popup 封装：文字按钮/图标触发器 + 弹出层，
 * 自动检测 content 插槽是否有可见内容，无可见内容时不渲染弹层。
 */

/** 触发器类型：button=文字按钮，icon=竖向三点图标 */
export type MorePopupType = 'button' | 'icon'

/**
 * MorePopup 更多弹层组件属性
 */
export interface MorePopupProps {
  /**
   * 触发器类型
   * @default 'button'
   */
  type?: MorePopupType
  /**
   * 按钮触发器的文案（type='button' 时生效）
   * @default '更多'
   */
  text?: string
  /**
   * 触发器附加 class（用于自定义按钮/图标样式）
   * @default ''
   */
  triggerClass?: string
  /**
   * 是否禁用（禁用时不可展开弹层）
   * @default false
   */
  disabled?: boolean
}

/**
 * MorePopup 更多弹层组件事件
 */
export interface MorePopupEmits {
  /**
   * 点击文字触发器时触发，可拿到 close 方法主动关闭弹层
   * @param payload { e: 点击事件对象, close: 关闭弹层方法 }
   */
  'triggle-text-click': [payload: { e: Event; close: () => void }]
}

/**
 * MorePopup 更多弹层组件插槽
 */
export interface MorePopupSlots {
  /**
   * 按钮触发器的文案插槽（覆盖 text 属性）
   */
  text?: () => unknown
  /**
   * 弹层内容。会被隐藏探测器渲染以检测可见性，
   * 所有子元素均不可见（display:none 等）时不渲染弹层
   */
  content: () => unknown
}
