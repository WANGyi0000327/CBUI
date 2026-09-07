/**
 * NumericInput 数字输入框组件类型
 * ----------------------------------------------------------------
 * 基于 TDesign t-input 封装：限制小数位数（decimalPlaces）、
 * 失焦时按 min/max 钳制并四舍五入，v-model 绑定 number | null | undefined。
 */

/**
 * NumericInput 数字输入框组件属性
 */
export interface NumericInputProps {
  /**
   * 保留小数位数
   * @default 2
   */
  decimalPlaces?: number
  /**
   * 最大值（失焦时钳制）
   * @default Infinity
   */
  max?: number
  /**
   * 最小值（失焦时钳制）
   * @default -Infinity
   */
  min?: number
}

/**
 * NumericInput 数字输入框组件事件
 */
export interface NumericInputEmits {
  /**
   * 失焦（已按 min/max 钳制并四舍五入）
   */
  blur: []
  /**
   * 值变化（透传 t-input 的 change）
   * @param value 变化后的数值
   */
  change: [value: number]
}
