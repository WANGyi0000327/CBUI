/**
 * CurrencyInput 金额输入框组件类型
 * ----------------------------------------------------------------
 * 基于 TDesign t-input-number 封装，附加金额范围校验与提示
 */

/**
 * CurrencyInput 金额输入框组件属性
 */
export interface CurrencyInputProps {
  /**
   * 小数位数
   * @default 2
   */
  decimalPlaces?: number
  /**
   * 最大值（超过时 blur 触发提示/回填）
   * @default 9999999.99
   */
  max?: number
  /**
   * 最小值（低于时 blur 清空并提示）
   * @default 0
   */
  min?: number
  /**
   * 字段语义名称（用于提示文案，如"价格不能小于0"）
   * @default '价格'
   */
  text?: string
  /**
   * 是否允许输入 0
   * @default true
   */
  allowInputZero?: boolean
  /**
   * 输入 0 时的提示文案（allowInputZero=false 时生效）
   * @default '不能输入0'
   */
  inputZeroMessage?: string
  /**
   * 占位提示
   * @default '请输入价格'
   */
  placeholder?: string
  /**
   * 超过最大值时是否弹出提示
   * @default true
   */
  ishint?: boolean
  /**
   * 超过最大值时是否自动回填为 max
   * @default true
   */
  isassignment?: boolean
  /**
   * 是否显示后缀"元"
   * @default true
   */
  isShowSuffix?: boolean
}

/**
 * 通过 defineExpose 暴露的实例方法
 */
export interface CurrencyInputInstance {
  /** 聚焦输入框 */
  focus: () => Promise<void>
}
