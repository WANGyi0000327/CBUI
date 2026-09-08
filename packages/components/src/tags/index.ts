/**
 * CbTags 标签折叠组件入口
 * ----------------------------------------------------------------
 * SFC 内部 defineOptions name 为 'CbTags'（符合 Cb 前缀约定），
 * 因此无需 HOC 包装层，此文件仅作为导出门面（barrel），
 * 供 gen:index 扫描与 resolver 按需加载。
 */
import Tags from './Tags.vue'
import type { CbTagsProps } from './types'

export { Tags }
export type { CbTagsProps }
export default Tags
