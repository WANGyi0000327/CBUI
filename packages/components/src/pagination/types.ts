/**
 * Pagination 分页组件类型
 * ----------------------------------------------------------------
 * 基于 TDesign t-pagination 封装：内置每页条数选择（30/50/100）、
 * 快捷跳页、最多 7 个页码按钮；total 为 0 时不渲染。
 * current / pageSize 通过 v-bind="$attrs" 透传（v-model:current / v-model:pageSize）。
 */

/**
 * Pagination 分页组件属性
 */
export interface PaginationProps {
  /**
   * 每页条数可选项
   * @default [{ label: '30 条/页', value: 30 }, { label: '50 条/页', value: 50 }, { label: '100 条/页', value: 100 }]
   */
  pageSizeOptions?: Array<{ label: string; value: number }>
  /**
   * 数据总条数（为 0 时不渲染分页条）
   */
  total: number
}
