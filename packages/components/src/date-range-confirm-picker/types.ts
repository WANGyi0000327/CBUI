/**
 * DateRangeConfirmPicker 日期范围确认选择器组件类型
 * ----------------------------------------------------------------
 * 基于 TDesign t-date-range-picker 封装
 * 核心行为：打开时备份当前值，取消（点击外部）回滚到备份，
 * 点击"确定"预设才真正提交 change，避免未确认就改动 v-model
 */

/**
 * DateRangeConfirmPicker 组件属性
 * 该组件未定义 defineProps，所有属性通过 $attrs 透传给 t-date-range-picker
 */
export type DateRangeConfirmPickerProps = Record<string, never>

/**
 * DateRangeConfirmPicker 组件事件
 */
export interface DateRangeConfirmPickerEmits {
  /** 点击"确定"预设时触发，payload 为当前选择的范围 */
  (e: 'change', value: string[] | undefined): void
}
