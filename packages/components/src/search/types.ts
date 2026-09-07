/**
 * CBSearch 搜索框组件类型
 * ----------------------------------------------------------------
 * 基于 TDesign t-input-adornment + t-input 封装：
 * 输入框 + 追加"搜索"按钮，v-model 双向绑定关键词，
 * 点击按钮触发 search 事件（透出当前关键词）。
 */
export interface CBSearchProps {
  /**
   * 输入框整体宽度
   * @default '300px'
   */
  inputWidth?: string
  /**
   * 占位提示文案
   * @default '请输入内容'
   */
  placeholder?: string
  /**
   * 是否显示清空按钮
   * @default true
   */
  clearable?: boolean
}
