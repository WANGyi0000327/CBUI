import type { CustomTreeKey, BackendTreeNode } from './index.d'
/**
 * 节点访问器
 */
function createNodeAccessor(keys: CustomTreeKey) {
  return {
    getId: (node: BackendTreeNode): string => {
      return node[keys.value]?.toString() || ''
    },
    getLabel: (node: BackendTreeNode): string => {
      return node[keys.label] || ''
    },
    getChildren: (node: BackendTreeNode): BackendTreeNode[] => {
      return node[keys.children] || []
    },
    hasChildren: (node: BackendTreeNode): boolean => {
      const children = node[keys.children]
      return Array.isArray(children) && children.length > 0
    },
  }
}
type ID = string | number
// 获取选中树
function getCheckedTreeNodes(tree: BackendTreeNode[]): BackendTreeNode[] {
  if (!tree) return []
  const traverse = (
    nodes: BackendTreeNode[],
    level: number = 0
  ): BackendTreeNode[] => {
    return nodes.map((node, index) => {
      // 递归处理子节点
      const children = node.children || []
      let processedChildren: BackendTreeNode[] = []
      let hasNoChildrenLevel = false
      if (children.length > 0) {
        processedChildren = traverse(children, level + 1)
        // 判断该节点的所有子元素是否都没有下级（都是叶子节点）
        hasNoChildrenLevel = processedChildren.every((child) => {
          return !child.children || child.children.length === 0
        })
      } else {
        // 如果没有子节点，当前节点就是叶子节点
        hasNoChildrenLevel = true
      }
      const showLine = index <= nodes.length - 1 && level === 1
      const endLine = index === nodes.length - 1 && level === 1
      // 创建带状态的新节点对象
      const newNode: BackendTreeNode = {
        ...node,
        level,
        showLine,
        endLine,
        hasNoChildrenLevel,
      }
      if (processedChildren.length > 0) {
        newNode.children = processedChildren
      }
      return newNode
    })
  }
  const trees = tree
    .map((node) => {
      // 处理子节点
      const children = node.children
        ? getCheckedTreeNodes(node.children)
        : undefined
      // 如果当前节点选中，或者有选中的子节点，则保留
      if (node.checked || (children && children.length > 0)) {
        return {
          ...node,
          children: children && children.length > 0 ? children : undefined,
        }
      }
      return null
    })
    .filter((node) => node !== null)
  return traverse(trees)
}
export function initializeTreeWithState(
  tree: BackendTreeNode[],
  keys: CustomTreeKey,
  disabledIds: ID[] = [],
  checkedKeys: ID[] = [],
  showChecked: boolean = false
): BackendTreeNode[] {
  const nodeAccessor = createNodeAccessor(keys)
  // 深度拷贝树数据
  const treeWithState = JSON.parse(JSON.stringify(tree))
  const traverse = (
    nodes: BackendTreeNode[],
    level: number = 0
  ): BackendTreeNode[] => {
    return nodes.map((node, index) => {
      const nodeId = nodeAccessor.getId(node)
      const isChecked = checkedKeys.includes(nodeId)
      // 递归处理子节点
      const children = nodeAccessor.getChildren(node)
      let processedChildren: BackendTreeNode[] = []
      let hasNoChildrenLevel = false
      if (children.length > 0) {
        processedChildren = traverse(children, level + 1)
        // 判断该节点的所有子元素是否都没有下级
        hasNoChildrenLevel = processedChildren.every((child) => {
          const childChildren = nodeAccessor.getChildren(child)
          return childChildren.length === 0
        })
      }
      const showLine = index <= nodes.length - 1 && level !== 0
      const endLine = index === nodes.length - 1 && level !== 0
      // 创建带状态的新节点对象
      const newNode: BackendTreeNode = {
        ...node,
        id: nodeId,
        label: nodeAccessor.getLabel(node),
        checked: isChecked,
        disabled: disabledIds?.indexOf(nodeId) !== -1,
        showLine,
        endLine,
        hasNoChildrenLevel,
      }
      if (children.length > 0) {
        newNode['children'] = processedChildren
      }
      return newNode
    })
  }
  let state = traverse(treeWithState, 0)
  if (showChecked) {
    state = getCheckedTreeNodes(state)
  }
  return state
}
/**
 * 更新节点选中状态并重新计算整个树的选中
 */
export function updateNodeWithCascade(
  tree: BackendTreeNode[],
  nodeId: string | number,
  checked: boolean,
  checkStrictly: boolean
): BackendTreeNode[] {
  // 深度拷贝树数据
  const newTree = JSON.parse(JSON.stringify(tree))
  if (checkStrictly) return updateSingleNodeState(newTree, nodeId, checked)
  /**
   * 1. 更新目标节点和向下级联子节点
   */
  const updateTargetAndChildren = (nodes: BackendTreeNode[]): boolean => {
    for (const node of nodes) {
      if (node.id === nodeId) {
        // 找到目标节点，更新状态
        if (!node.disabled) {
          node.checked = checked
        }
        // 向下级联：更新所有子节点
        if (node.children?.length) {
          updateAllChildren(node.children, checked)
        }
        return true
      }
      // 递归搜索子节点
      if (node.children?.length) {
        if (updateTargetAndChildren(node.children)) {
          return true
        }
      }
    }
    return false
  }
  /**
   * 更新所有子节点的选中状态
   */
  const updateAllChildren = (
    children: BackendTreeNode[],
    parentChecked: boolean
  ) => {
    for (const child of children) {
      if (!child.disabled) {
        child.checked = parentChecked
      }
      // 递归更新孙子节点
      if (child.children?.length) {
        updateAllChildren(child.children, parentChecked)
      }
    }
  }
  /**
   * 2. 向上级联更新父节点的选中
   */
  const updateParentStates = (
    nodes: BackendTreeNode[]
  ): { checked: boolean } => {
    for (const node of nodes) {
      let nodeChecked = node.checked || false
      // 如果有子节点，基于子节点计算状态
      if (node.children?.length) {
        // 先递归更新子节点的父状态
        const childrenStates = node.children.map((child: BackendTreeNode) =>
          updateParentStates([child])
        )
        const someChecked = childrenStates.some(
          (state: BackendTreeNode) => state.checked
        )
        // 更新父节点状态只有选中状态才可以更改父节点
        if (someChecked) nodeChecked = someChecked
      }
      // 更新节点状态
      node.checked = nodeChecked
      return { checked: nodeChecked }
    }
    return { checked: false }
  }
  // 执行更新
  updateTargetAndChildren(newTree)
  newTree.map((root: BackendTreeNode) => updateParentStates([root]))
  return newTree
}
const updateSingleNodeState = (
  tree: BackendTreeNode[],
  nodeId: string | number,
  checked: boolean
): BackendTreeNode[] => {
  let found = false
  const updateNodes = (nodes: any[]): any[] => {
    if (found) return nodes // 如果已经找到并更新，直接返回
    return nodes.map((node) => {
      // 如果找到目标节点，更新并标记
      if (node.id === nodeId) {
        found = true
        return { ...node, checked }
      }
      // 如果没有找到，继续在子节点中查找
      if (node.children && !found) {
        return { ...node, children: updateNodes(node.children) }
      }
      return node
    })
  }
  return updateNodes(tree)
}
export function getCheckedTreeIds(tree: BackendTreeNode[]): string[] {
  const checkedIds: string[] = []
  const traverse = (nodes: BackendTreeNode[]) => {
    nodes.forEach((node) => {
      if (node.checked) {
        checkedIds.push(node.id)
      }
      if (node.children && node.children.length > 0) {
        traverse(node.children)
      }
    })
  }
  traverse(tree)
  return checkedIds
}
