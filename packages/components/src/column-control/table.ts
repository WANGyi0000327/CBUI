// head_disabled: true, // 禁止开关加禁止拖拽
// Prohibit_switch: true, // 禁止开关
export interface TableColumn {
  colKey?: string
  title?: string
  width?: number
  fixed?: string
  ellipsis?: boolean
  align?: string
  cell?: string
  disabled?: boolean
}

export interface ColumnOption {
  label: string
  value: string
  fixed?: string
  disabled?: boolean
}

export interface ColumnConfig {
  visibleColumns: string[]
  columnOptions: ColumnOption[]
}

export interface ColumnControlProps {
  columnConfig: ColumnConfig
  visible: boolean
  allColumns: TableColumn[]
  defaultVisibleColumns: string[]
}
