/**
 * OverLimitInputNumber 超限输入数字框组件类型
 * ----------------------------------------------------------------
 * 基于 TDesign t-input-number 封装：两种超限策略——
 * 1. allowInputOverLimit=false：输入超出 min/max 时回滚到上一次有效值；
 * 2. enableTruncation=true：输入超出时自动截断到 min/max 边界。
 */
import type { InputNumberValue, ChangeContext } from 'tdesign-vue-next'

/**
 * OverLimitInputNumber 超限输入数字框组件属性
 */
export interface OverLimitInputNumberProps {
  /**
   * 是否启用截断模式：输入超出 min/max 时自动收敛到边界值
   * @default false
   */
  enableTruncation?: boolean
  /**
   * 是否允许输入超出限制的值；false 时超限输入会回滚到上一次有效值
   * @default true
   */
  allowInputOverLimit?: boolean
  /**
   * 最大值
   * @default Infinity
   */
  max?: number
  /**
   * 最小值
   * @default -Infinity
   */
  min?: number
}

/**
 * OverLimitInputNumber 超限输入数字框组件事件
 */
export interface OverLimitInputNumberEmits {
  /**
   * 值变化（透传 t-input-number 的 change）
   * @param value 变化后的值
   * @param context 变化上下文（触发来源等）
   */
  change: [value: InputNumberValue, context: ChangeContext]
}
