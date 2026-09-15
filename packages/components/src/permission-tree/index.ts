/**
 * CbPermissionTree 权限树组件入口
 * ----------------------------------------------------------------
 * SFC 内部 defineOptions name 为 'CbPermissionTree'，
 * 引入时使用 <CbPermissionTree> 标签。此文件仅作为导出门面（barrel），
 * 供 gen:index 扫描与 resolver 按需加载。
 */
import PermissionTree from './PermissionTree.vue'
import type { CustomTreeKey, BackendTreeNode, CheckedInfo, TreeSelectionConfig } from './index.d'

export { PermissionTree }
export type { CustomTreeKey, BackendTreeNode, CheckedInfo, TreeSelectionConfig }
export default PermissionTree
