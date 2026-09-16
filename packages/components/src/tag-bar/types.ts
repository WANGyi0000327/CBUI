/**
 * CbTagBar 多标签栏组件类型
 * ----------------------------------------------------------------
 * 基于 t-tabs(theme="card") 的多标签导航栏：支持点击切换（jump）、
 * 关闭标签（close）、右键菜单（关闭其他 / 刷新页面）。
 * 组件为泛型组件（generic T extends Record<string, any>），
 * 默认约束见 TagBarTab。
 */

/**
 * 标签页数据（默认约束）
 */
export interface TagBarTab {
  /**
   * 路由路径（标签唯一 key 与 value）
   */
  path: string
  /**
   * 标签元信息
   */
  meta: {
    /**
     * 标签标题
     */
    title: string
  }
  [key: string]: unknown
}

/**
 * CbTagBar 多标签栏组件属性
 */
export interface CbTagBarProps<T = TagBarTab> {
  /**
   * 当前激活的路由 path
   */
  activeTab?: string
  /**
   * 标签页数据列表
   */
  tabs?: T[]
}
