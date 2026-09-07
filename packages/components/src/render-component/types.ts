/**
 * RenderComponent 渲染函数包装器组件类型
 * ----------------------------------------------------------------
 * 接收 render 回调（返回 VNode），动态渲染任意组件；
 * 常用于需要以 render 函数形式注入组件、又希望以组件方式使用的场景。
 */
import type { VNode } from 'vue'

/**
 * RenderComponent 渲染函数包装器组件属性
 */
export interface RenderComponentProps {
  /**
   * 渲染回调，返回要渲染的 VNode（接收 h 参数）
   */
  render: (h: any) => VNode
}

/**
 * RenderComponent 渲染函数包装器组件事件
 */
export interface RenderComponentEmits {
  /**
   * value 更新（预留给 v-model:value 转发）
   * @param value 更新后的值
   */
  'update:value': [value: any]
}
