/**
 * CbCollapseSidebar 可折叠侧边栏组件属性
 */
export interface CbCollapseSidebarProps {
  /** 侧边栏位置 */
  side?: 'left' | 'right'
  /** 主题：light 默认 / brand 品牌色折叠按钮 */
  theme?: 'light' | 'brand'
  /** 是否可拖拽调整宽度 */
  resizable?: boolean
  /** 初始宽度 */
  initWidth?: number
  /** 最小宽度（拖拽） */
  minWidth?: number
  /** 最大宽度（拖拽） */
  maxWidth?: number
  /** 当前宽度（v-model:width） */
  width?: number
}
