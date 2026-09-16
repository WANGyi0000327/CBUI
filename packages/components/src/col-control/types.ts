export interface ColControlColumn {
  colKey: string
  title?: string
  displayName?: string
  dispalyTitle?: string
  fixed?: 'left' | 'right'
  visible?: boolean
  disabled?: boolean
  [key: string]: unknown
}

export interface CbColControlProps {
  /** 左侧文案，默认 '操作' */
  label?: string
  /** 列配置项 */
  options?: ColControlColumn[]
  /** 应用编码（远程配置保存） */
  appCode: string
  /** 表格编码（远程配置保存） */
  tableCode: string
  /** 透传给 t-popup 的额外属性 */
  popupProps?: Record<string, unknown>
}
