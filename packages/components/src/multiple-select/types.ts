/**
 * MultipleSelect 多选下拉组件类型
 * ----------------------------------------------------------------
 * 基于 TDesign t-select 封装：multiple 多选 + 面板顶部"全选"复选框，
 * 支持通过 keys 自定义选项字段映射（value / label / disabled）。
 * 组件为泛型组件（generic T），T 为选项数据项类型。
 */
import type { KeysType } from 'tdesign-vue-next'

/**
 * MultipleSelect 多选下拉组件属性
 */
export interface MultipleSelectProps<T = Record<string, any>> {
  /**
   * 选项数据列表
   */
  list?: T[]
  /**
   * 选项字段映射：value / label / disabled 对应的数据字段名
   * @default { value: 'value', label: 'label', disabled: 'disabled' }
   */
  keys?: KeysType
}
