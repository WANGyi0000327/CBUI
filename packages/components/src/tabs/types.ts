/**
 * Cbtabs 标签页切换组件类型
 * ----------------------------------------------------------------
 * 基于 t-radio-group 的标签页切换，v-model 绑定当前选中 id，
 * 切换时同时触发 tab_chk 事件。
 */

/**
 * 标签页配置项
 */
export interface typeTab {
  /**
   * 标签 id（作为 t-radio-button 的 value 与 v-model 绑定值）
   */
  id: number
  /**
   * 标签文案
   */
  label: string
  /**
   * 标签关联值（业务预留）
   */
  value: number
}

/**
 * Cbtabs 标签页切换组件属性
 */
export interface CbTabsProps {
  /**
   * 标签页配置列表
   */
  type_tab?: typeTab[]
}
