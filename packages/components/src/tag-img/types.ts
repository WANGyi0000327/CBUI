/**
 * CbTagImg 状态图标文本组件类型
 * ----------------------------------------------------------------
 * 按 status 从 typeList 匹配状态配置，展示对应图标 + 彩色文本；
 * 无 status 或无匹配时展示占位符 '-'。
 */

/**
 * 状态配置项（图标模式）
 */
export interface tagType {
  /**
   * 状态 id（匹配 status）
   */
  id?: string | number
  /**
   * 状态名称
   */
  name?: string
  /**
   * 图标颜色
   */
  color?: string
  /**
   * 状态标签（name 的备选）
   */
  label?: string
  /**
   * 状态值（匹配 status，可与 id 二选一）
   */
  value?: boolean | string | number
  /**
   * 图标名（cb-icon name）
   */
  icon?: string
  /**
   * 文本颜色
   */
  textcolor?: string
}

/**
 * CbTagImg 状态图标文本组件属性
 */
export interface TagImgProps {
  /**
   * 状态配置列表（按 id / value 匹配 status）
   */
  typeList?: tagType[]
  /**
   * 当前状态值
   */
  status?: string | number
  /**
   * 变体（预留）
   */
  variant?: string
}
