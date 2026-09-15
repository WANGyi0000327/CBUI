/**
 * CbColumnControl 列设置组件入口
 * ----------------------------------------------------------------
 * SFC 内部 defineOptions name 为 'CbColumnControl'，
 * 引入时使用 <CbColumnControl> 标签。此文件仅作为导出门面（barrel），
 * 供 gen:index 扫描与 resolver 按需加载。
 */
import ColumnControl from './ColumnControl.vue'
import type { TableColumn, ColumnOption, ColumnConfig, ColumnControlProps } from './table'

export { ColumnControl }
export type { TableColumn, ColumnOption, ColumnConfig, ColumnControlProps }
export default ColumnControl
