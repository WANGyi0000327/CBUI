/**
 * PageLayout 页面布局容器组件入口
 * ----------------------------------------------------------------
 * SFC 内部 defineOptions name 已是 'CbPageLayout'（符合 Cb 前缀约定），
 * 因此无需 HOC 包装层，此文件仅作为导出门面（barrel），
 * 供 gen:index 扫描与 resolver 按需加载。
 * 同时 re-export CbPageLayoutInstance 实例类型（PageLayout.vue 从 './index' 导入）。
 */
import PageLayout from './PageLayout.vue'
import type { CbPageLayoutInstance } from './types'

export { PageLayout }
export type { CbPageLayoutInstance }
export default PageLayout
