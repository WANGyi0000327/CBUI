/**
 * OverBtns 操作按钮组组件类型
 * ----------------------------------------------------------------
 * 基于 TDesign t-button / t-popup 封装：前 maxShownNum 个按钮直接展示，
 * 超出部分折叠进 popup 弹层，支持 enablehide 权限隐藏、disabled 禁用、
 * 动态 label / style 等能力。
 */
import type { OverBtn } from './utils/overBtns'

/**
 * OverBtns 操作按钮组组件属性
 */
export interface OverBtnsProps {
  /**
   * 操作按钮配置列表
   */
  btnList: OverBtn[]
  /**
   * 直接展示的按钮数量，超出部分折叠到 popup
   * @default 2
   */
  maxShownNum?: number
  /**
   * 当前行数据（传给按钮的 label / disabled / clickHandler 等）
   */
  row?: Record<string, any>
  /**
   * 折叠图标触发器样式
   * @default { width: '30px' }
   */
  iconStyle?: Record<string, string>
}
