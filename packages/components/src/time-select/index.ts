/**
 * CbTimeSelect 时间筛选组件入口
 * ----------------------------------------------------------------
 * SFC 内部 defineOptions name 为 'CbTimeSelect'（符合 Cb 前缀约定），
 * 因此无需 HOC 包装层，此文件仅作为导出门面（barrel），
 * 供 gen:index 扫描与 resolver 按需加载。
 * TimeFilterValue / TimeFilterArrayValue 由 SFC 内 <script setup> 类型导出
 * 提供，此处同时从 types.ts 再导出以统一类型入口。
 */
import TimeSelect from './TimeSelect.vue'
import type { CbTimeSelectProps, TimeFilterValue, TimeFilterArrayValue } from './types'

export { TimeSelect }
export type { CbTimeSelectProps, TimeFilterValue, TimeFilterArrayValue }
export default TimeSelect
