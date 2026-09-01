/**
 * ButtonFold 折叠按钮组件类型
 * ----------------------------------------------------------------
 * 把多个操作按钮按 expendNum 数量折叠展示，超出部分收进 Popup 弹出层
 */

/** 展示类型：icon=图标更多按钮，moreBtn=文字更多按钮 */
export type ButtonFoldType = 'icon' | 'moreBtn'

/**
 * ButtonFold 折叠按钮组件属性
 */
export interface ButtonFoldProps {
  /**
   * 更多按钮文案（type='moreBtn' 时生效）
   * @default '更多'
   */
  operationName?: string
  /**
   * 直接展示的操作数量，超出部分折叠到弹出层
   * @default 1
   */
  expendNum?: number
  /**
   * 是否禁用全部操作
   * @default false
   */
  disabledAll?: boolean
  /**
   * 弹出层自定义 class
   * @default ''
   */
  overlayClassName?: string
  /**
   * 展示类型：icon=图标更多按钮，moreBtn=文字更多按钮
   * @default 'icon'
   */
  type?: ButtonFoldType
}
