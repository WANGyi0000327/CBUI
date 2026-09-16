<template>
  <component :is="renderContent" />
</template>
<script setup lang="ts">
defineOptions({
  name: 'CbRenderComponent',
})
import { computed, h } from 'vue'
// 兼容层：业务项目中的 CbRenderComponent 组件。
// render 支持两种写法：
//   1. 渲染函数：(h, params) => VNode（h 为 createElement）
//   2. 渲染函数：(params) => VNode，params = { modelValue, field, onUpdate }（动态表单 content 用法）
// 自动转发外部 attrs（如 onUpdate:value），且不覆盖 render 返回 VNode 上已有的同名监听（尊重业务侧）。
const props = defineProps({
  render: {
    type: Function,
    required: true,
  },
  field: {
    type: Object,
    default: () => ({}),
  },
})
const modelValue = defineModel<unknown>()
const emit = defineEmits(['update:value'])
const onUpdate = (v: unknown) => {
  modelValue.value = v
}
const isVNode = (v: unknown): boolean => {
  if (!v || typeof v !== 'object') return false
  const node = v as { __v_isVNode?: boolean; type?: unknown }
  return node.__v_isVNode === true || !!node.type
}
const renderContent = computed(() => {
  const fn = props.render
  // 非函数（组件对象等）直接作为组件渲染
  if (typeof fn !== 'function') return fn
  return (nodeProps: Record<string, unknown>, ctx: { attrs?: Record<string, unknown> }) => {
    const params = {
      modelValue: modelValue.value,
      field: props.field,
      onUpdate,
    }
    let vnode: ReturnType<typeof h> | null = null
    // 优先尝试对象参数写法（content 用法）
    try {
      const res = fn(params)
      if (isVNode(res)) {
        vnode = res
      }
    } catch {
      vnode = null
    }
    // 回退为 h 参数写法
    if (!vnode) {
      const res = fn(h, params)
      if (isVNode(res)) vnode = res
    }
    if (!vnode) return null
    // 透传外部 attrs（如 onUpdate:value），不覆盖 VNode 已有的监听
    if (ctx && ctx.attrs && vnode.props) {
      for (const key in ctx.attrs) {
        if (!(key in vnode.props)) {
          vnode.props[key] = ctx.attrs[key]
        }
      }
    }
    // 监听内部组件 onChange：先调用业务侧监听（若有），再转发为 update:value
    // （TDesign 输入类组件输入变化时触发 onChange，而非 update:value）
    if (vnode.props) {
      const originalOnChange = vnode.props.onChange
      vnode.props.onChange = (...args: unknown[]) => {
        if (typeof originalOnChange === 'function') {
          originalOnChange(...args)
        }
        emit('update:value', args[0])
      }
    }
    return vnode
  }
})
</script>
