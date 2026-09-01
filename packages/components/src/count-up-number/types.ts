/**
 * CountUpNumber 数字动画组件类型
 * ----------------------------------------------------------------
 * 基于 countup.js 封装，负责把数字以动画方式平滑过渡展示
 */

/**
 * CountUpNumber 数字动画组件属性
 */
export interface CountUpNumberProps {
  /**
   * 是否开启大数格式化（超过 10000 自动转为 w 结尾，保留最多两位小数）
   * @default false
   */
  formatting?: boolean
  /**
   * 当前需要展示的目标数值
   * 当该值变化时，组件会自动触发平滑过渡动画
   */
  value: number
  /**
   * 动画时长，单位为秒
   * @default 1.5
   */
  duration?: number
  /**
   * 是否启用数字缓动
   * 开启后数字变化会更自然，适合看板、统计卡片等场景
   * @default true
   */
  useEasing?: boolean
  /**
   * 是否启用千分位分组
   * 统计类数据通常需要更好的可读性，因此默认开启
   * @default true
   */
  useGrouping?: boolean
  /**
   * 千分位分隔符
   * @default ','
   */
  separator?: string
  /**
   * 小数点符号
   * @default '.'
   */
  decimal?: string
}
