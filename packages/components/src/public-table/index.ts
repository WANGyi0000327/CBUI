/**
 * CbPublicTable 公开表格组件入口
 * ----------------------------------------------------------------
 * SFC 内部 defineOptions name 为 'CbPublicTable'，
 * 引入时使用 <CbPublicTable> 标签。此文件仅作为导出门面（barrel），
 * 供 gen:index 扫描与 resolver 按需加载。
 */
import PublicTable from './PublicTable.vue'
import type { ConfigType, PageInfo, ReqForm, HighSearchItem } from './interface'

export { PublicTable }
export type { ConfigType, PageInfo, ReqForm, HighSearchItem }
export default PublicTable
