/**
 * CbSearchInput 搜索输入框组件类型
 * ----------------------------------------------------------------
 * 基于 TDesign t-input 封装：输入框内嵌"搜索"按钮与清空图标，
 * v-model 双向绑定（自动 trim），回车或点击搜索按钮触发 search 事件，
 * 支持 disabled / loading（预留）/ searchwidth 宽度控制。
 */

/**
 * CbSearchInput 搜索输入框组件属性
 */
export interface SearchInputProps {
  /**
   * 是否加载中（预留，t-loading 已注释）
   * @default false
   */
  loading?: boolean
  /**
   * 是否禁用
   * @default false
   */
  disabled?: boolean
  /**
   * 输入框宽度
   * @default '300px'
   */
  searchwidth?: string
}
