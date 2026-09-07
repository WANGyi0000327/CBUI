/**
 * OverLimitInputNumber 超限输入数字框组件入口
 * ----------------------------------------------------------------
 * SFC 内部 defineOptions name 已是 'CbOverLimitInputNumber'（符合 Cb 前缀约定），
 * 因此无需 HOC 包装层，此文件仅作为导出门面（barrel），
 * 供 gen:index 扫描与 resolver 按需加载。
 */
import OverLimitInputNumber from './OverLimitInputNumber.vue'
import type { OverLimitInputNumberProps, OverLimitInputNumberEmits } from './types'

export { OverLimitInputNumber }
export type { OverLimitInputNumberProps, OverLimitInputNumberEmits }
export default OverLimitInputNumber
