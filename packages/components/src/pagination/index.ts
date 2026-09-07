/**
 * Pagination 分页组件入口
 * ----------------------------------------------------------------
 * SFC 内部 defineOptions name 已是 'CbPagination'（符合 Cb 前缀约定），
 * 因此无需 HOC 包装层，此文件仅作为导出门面（barrel），
 * 供 gen:index 扫描与 resolver 按需加载。
 */
import Pagination from './Pagination.vue'
import type { PaginationProps } from './types'

export { Pagination }
export type { PaginationProps }
export default Pagination
