export interface CustomTreeKey {
  value: string
  label: string
  children: string
}
export interface TreeNodeState {
  checked: boolean
  disabled?: boolean
  showLine: boolean
  endLine: boolean
  hasNoChildrenLevel: boolean
}
export interface TreeState {
  [nodeId: string]: TreeNodeState
}
export interface BackendTreeNode {
  [key: string]: any
}
export interface CheckedInfo {
  checkedNodes: BackendTreeNode[]
  checkedKeys: string[]
  halfCheckedNodes: BackendTreeNode[]
  halfCheckedKeys: string[]
}
export interface TreeSelectionConfig {
  checkStrictly?: boolean // 是否严格模式（不级联）
  disabledKeys?: string[] // 禁用的节点keys
  defaultCheckedKeys?: string[] // 默认选中的keys
  cascade?: boolean // 是否级联选择
  autoUpdateParents?: boolean // 是否自动更新父节点状态
  autoUpdateChildren?: boolean // 是否自动更新子节点状态
}
