/**
 * CbTimeSelect 时间筛选组件类型
 * ----------------------------------------------------------------
 * 年月选择器（年份箭头切换 + 月份点选），输出时间范围。
 * 支持对象格式（默认）与数组格式两种 modelValue 形态。
 */

/**
 * 时间筛选对象格式（默认输出）
 */
export interface TimeFilterValue {
  /**
   * 选中年份
   */
  year: number
  /**
   * 选中月份（null 表示全年）
   */
  month: number | null
  /**
   * 时间范围
   */
  timeRange: {
    /**
     * 开始时间（YYYY-MM-DD 00:00:00）
     */
    start: string
    /**
     * 结束时间（YYYY-MM-DD 23:59:59）
     */
    end: string
  }
}

/**
 * 时间筛选数组格式（formatType="array" 时输出）
 */
export type TimeFilterArrayValue = [string, string]

/**
 * CbTimeSelect 时间筛选组件属性
 */
export interface CbTimeSelectProps {
  /**
   * 选中值（对象或数组格式，二者兼容输入）
   */
  modelValue?: Partial<TimeFilterValue> | TimeFilterArrayValue
  /**
   * 初始模式：current 定位当前月，default 定位 1 月
   */
  type?: 'current' | 'default'
  /**
   * 标题文案
   */
  title?: string
  /**
   * 是否锁定在上个月模式
   */
  isLastMonth?: boolean
  /**
   * 是否支持全年选择（month 为 null）
   */
  supportFullYear?: boolean
  /**
   * 是否支持未来时间选择（当前年月 +10 年）
   */
  future?: boolean
  /**
   * 返回数据格式：object 对象 / array 数组
   */
  formatType?: 'object' | 'array'
}
