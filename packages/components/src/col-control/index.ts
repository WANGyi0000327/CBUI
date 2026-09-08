/**
 * CbColControl 列设置组件入口
 * ----------------------------------------------------------------
 * SFC 内部 defineOptions name 为 'CbColControl'，
 * 引入时使用 <CbColControl> 标签。此文件仅作为导出门面（barrel），
 * 供 gen:index 扫描与 resolver 按需加载。
 */
import ColControl from './ColControl.vue'
import type { CbColControlProps, ColControlColumn } from './types'

export { ColControl }
export type { CbColControlProps, ColControlColumn }
export default ColControl
