import type { DialogProps } from 'tdesign-vue-next'

/**
 * CommonDialog 通用弹窗组件属性
 */
export interface BaseDialogProps extends Omit<
  DialogProps,
  'title' | 'showHeader' | 'showFooter' | 'visible' | 'confirmBtn'
> {
  placement?: DialogProps['placement'] /** 弹窗位置（可选，默认为 'center'） */
  closeBtnText?: string /** 取消按钮文本（可选，默认为 '取消'） */
  confirmBtnText?: string /** 确定按钮文本（可选，默认为 '确定'） */
  loading?: boolean /** 按钮是否加载中（可选，默认为 false） */
  visible: boolean /** 弹窗可见性（必传，由父组件控制） */
  title?: string /** 弹窗标题 */
  width?: number | string /** 弹窗宽度（支持数字/字符串，如 500、'80%'） */
  draggable?: boolean /** 是否支持拖拽（默认 false） */
  close?: () => void /** 关闭弹窗的回调（可选，父组件需处理 visible 状态） */
  showheader?: boolean // 自定义头部显示与否（可选，默认为 true）
  showfooter?: boolean // 自定义底部显示与否（可选，默认为 true）
  closeOnOverlayClick?: boolean // 点击遮罩层是否关闭弹窗（可选，默认为 true）
  closeOnEscKeydown?: boolean // 点击 ESC 键是否关闭弹窗（可选，默认为 true）
  showOverlay?: boolean // 是否显示遮罩层（可选，默认为 true）
  confirm?: () => void // 确定按钮的回调（可选，父组件需处理 visible 状态）
  open?: () => void // 弹窗打开时的回调（可选）
  beforeOpen?: () => void // 弹窗打开前的回调（可选）
  confirmBtn?: boolean // 是否显示确定按钮（可选，默认为 true）
  closeBtn?: boolean // 是否显示取消按钮（可选，默认为 true）
  customBorder?: boolean // 顶部线条样式
  bgBorder?: boolean // 背景线条样式
  theme?: DialogProps['theme'] // 弹窗主题
  destroyOnClose?: boolean // 关闭弹窗时是否销毁 DOM 元素（可选，默认为 false）
  attach?: string // 弹窗挂载元素
  dialogCloseBtn?: boolean
  onBeforeClose?: () => void // 弹窗关闭前的回调（可选）
  zIndex?: number
}
