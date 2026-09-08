/**
 * CommonDialog 通用弹窗组件入口
 * ----------------------------------------------------------------
 * SFC 内部 defineOptions name 为 'CommonDialog'（用户指定，非 Cb 前缀），
 * 因此无需 HOC 包装层，此文件仅作为导出门面（barrel），
 * 供 gen:index 扫描与 resolver 按需加载。
 */
import CommonDialog from './CommonDialog.vue'
import type { BaseDialogProps } from './types'

export { CommonDialog }
export type { BaseDialogProps }
export default CommonDialog
