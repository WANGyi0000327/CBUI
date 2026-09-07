/**
 * RenderComponent 渲染函数包装器组件入口
 * ----------------------------------------------------------------
 * SFC 内部 defineOptions name 已是 'CbRenderComponent'（符合 Cb 前缀约定），
 * 因此无需 HOC 包装层，此文件仅作为导出门面（barrel），
 * 供 gen:index 扫描与 resolver 按需加载。
 */
import RenderComponent from './RenderComponent.vue'
import type { RenderComponentProps, RenderComponentEmits } from './types'

export { RenderComponent }
export type { RenderComponentProps, RenderComponentEmits }
export default RenderComponent
