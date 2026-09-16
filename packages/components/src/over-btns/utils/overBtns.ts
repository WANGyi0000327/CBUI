/**
 * OverBtns 操作按钮组类型
 * ----------------------------------------------------------------
 * 定义操作按钮的配置结构（label / type / clickHandler / 权限控制等）。
 */
interface OverBtn {
  label: string | ((row: OverRow) => string)
  type: string
  clickHandler: (type: string, row: OverRow) => void
  colorType?: number // 1 红色字体
  disabled?: boolean | ((row: OverRow) => boolean) // 支持布尔值或接收row的函数
  enablehide?: boolean | ((row?: OverRow) => boolean) // 支持布尔值或接收row的函数
  enablehide_hide?: boolean | ((row?: OverRow) => boolean) // 支持布尔值或接收row的函数
  style?: Record<string, string> // 自定义样式
  theme?: boolean // 是否使用主题颜色
  isPermission?: boolean | (() => boolean) //按钮权限
  class?: Record<string, string>
}

interface OverRow {
  [key: string]: unknown
}

export type { OverBtn, OverRow }
