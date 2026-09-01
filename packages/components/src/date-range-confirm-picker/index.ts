/**
 * DateRangeConfirmPicker 日期范围确认选择器组件入口
 * ----------------------------------------------------------------
 * 该组件模板未使用 <cb-icon>，且 SFC 内部 defineOptions name 已是
 * 'CbDateRangeConfirmPicker'（符合 Cb 前缀约定），因此无需 HOC 包装层
 * 注意：组件依赖 v-click-outside 指令，该指令由 CBUI.install 全局注册
 * （见 src/directives/clickOutside.ts 与 generate-index.mjs 的 install 模板）
 */
import DateRangeConfirmPicker from './DateRangeConfirmPicker.vue'
import type {
  DateRangeConfirmPickerProps,
  DateRangeConfirmPickerEmits,
} from './types'

export { DateRangeConfirmPicker }
export type { DateRangeConfirmPickerProps, DateRangeConfirmPickerEmits }
export default DateRangeConfirmPicker
