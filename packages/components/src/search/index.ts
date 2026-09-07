/**
 * CBSearch 搜索框组件入口
 * ----------------------------------------------------------------
 * SFC 内部 defineOptions name 为 'CBSearch'（用户指定，非 Cb 前缀），
 * 引入时使用 <CBSearch> 标签。此文件仅作为导出门面（barrel），
 * 供 gen:index 扫描与 resolver 按需加载。
 */
import Search from './Search.vue'
import type { CBSearchProps } from './types'

export { Search }
export type { CBSearchProps }
export default Search
