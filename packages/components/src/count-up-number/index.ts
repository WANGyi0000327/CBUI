/**
 * CountUpNumber 数字动画组件入口
 * ----------------------------------------------------------------
 * 该组件模板未使用 <cb-icon>，且 SFC 内部 defineOptions name 已是
 * 'CbCountUpNumber'（符合 Cb 前缀约定），因此无需 HOC 包装层：
 * - 全量注册名直接来自 SFC 的 name
 * - 无需注入 CbIcon
 * 此文件仅作为导出门面（barrel），供 gen:index 扫描与 resolver 按需加载
 */
import CountUpNumber from './CountUpNumber.vue'
import type { CountUpNumberProps } from './types'

export { CountUpNumber }
export type { CountUpNumberProps }
export default CountUpNumber
