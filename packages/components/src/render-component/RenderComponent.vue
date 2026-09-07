<template>
  <component :is="renderComponent" />
</template>
<script setup lang="ts">
defineOptions({
  name: 'CbRenderComponent',
})
import { h, computed, defineComponent } from 'vue'
import type { VNode } from 'vue'
interface Props {
  render: (h: any) => VNode
}
const props = defineProps<Props>()
const emit = defineEmits<{
  'update:value': [value: any]
}>()
// 创建渲染组件
const renderComponent = computed(() => {
  return defineComponent({
    render() {
      const vnode = props.render(h)
      // 如果渲染的是 TDesign 组件，自动处理 v-model
      if (
        vnode.props &&
        !vnode.props.onChange &&
        !vnode.props['onUpdate:value']
      ) {
        vnode.props = {
          ...vnode.props,
          onChange: (val: any) => emit('update:value', val),
          'onUpdate:value': (val: any) => emit('update:value', val),
        }
      }
      return vnode
    },
  })
})
</script>
