/**
 * CbTimeSelectLine 时间轴组件类型
 * ----------------------------------------------------------------
 * 竖向时间轴：按月份展示时间节点（超出数据范围自动扩展 showMoreMonth 个月），
 * 已完成月份打勾、进行中月份显示进度图标，点击节点回传 change。
 */

/**
 * 时间轴节点项
 */
export interface MonthItem {
  /**
   * 年份（YYYY）
   */
  year: string
  /**
   * 月份（1-12，年份节点为 null）
   */
  month: string | null
  /**
   * 唯一 key（YYYYMM，年份节点为 year-YYYY）
   */
  key: string
  /**
   * 完成状态：true 已完成 / false 进行中 / null 超出范围不可点
   */
  completed: boolean | null
  /**
   * 是否为年份节点
   */
  isYear: boolean
}

/**
 * CbTimeSelectLine 时间轴组件属性
 */
export interface CbTimeSelectLineProps {
  /**
   * 容器高度
   */
  height?: string
  /**
   * 数据范围 [开始时间, 结束时间]（YYYYMM 格式）
   */
  timeRanges?: string[]
  /**
   * 已完成截止时间（可为 null，null 表示无已完成）
   */
  completedTime?: string | null
  /**
   * 已完成图标名（cb-icon）
   */
  completedIcon?: string
  /**
   * 进行中图标名（cb-icon）
   */
  progressIcon?: string
  /**
   * 是否在数据范围外额外展示 4 个月（不可点）
   */
  showMoreMonth?: boolean
}
