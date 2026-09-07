/**
 * OverBtns 操作按钮组组件入口
 * ----------------------------------------------------------------
 * SFC 内部 defineOptions name 已是 'CbOverBtns'（符合 Cb 前缀约定），
 * 因此无需 HOC 包装层，此文件仅作为导出门面（barrel），
 * 供 gen:index 扫描与 resolver 按需加载。
 * 同时导出 OverBtn / OverRow 类型，供业务侧配置按钮列表使用。
 */
import OverBtns from './OverBtns.vue'
import type { OverBtnsProps } from './types'
import type { OverBtn, OverRow } from './utils/overBtns'

export { OverBtns }
export type { OverBtnsProps, OverBtn, OverRow }
export default OverBtns
