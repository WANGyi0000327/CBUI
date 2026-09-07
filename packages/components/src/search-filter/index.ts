/**
 * CbSearchFilter 筛选弹层组件入口
 * ----------------------------------------------------------------
 * SFC 内部 defineOptions name 为 'CbSearchFilter'（符合 Cb 前缀约定），
 * 因此无需 HOC 包装层，此文件仅作为导出门面（barrel），
 * 供 gen:index 扫描与 resolver 按需加载。
 */
import SearchFilter from './SearchFilter.vue'
import type { SearchFilterProps, FormItem } from './types'

export { SearchFilter }
export type { SearchFilterProps, FormItem }
export default SearchFilter
