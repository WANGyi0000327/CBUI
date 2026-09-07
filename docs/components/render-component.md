---
title: RenderComponent 渲染函数包装器
---

<script setup>
import { Input as TInput, Button as TButton } from 'tdesign-vue-next'
const renderInput = (h) =>
  h(TInput, { placeholder: 'render 函数渲染的输入框', style: 'width: 240px' })
const renderTag = (h) =>
  h('div', { style: 'color: var(--td-brand-color); font-weight: 600;' }, '通过 render 函数渲染的任意内容')
</script>

# RenderComponent 渲染函数包装器

以**组件方式**接收 `render` 回调（返回 VNode）并动态渲染任意组件/内容的包装器。适用于：业务侧习惯用 `render` 函数注入 UI（如列配置、动态表单），又希望以组件标签形式接入的场景。

> 特性说明：
> - 接收 `render: (h) => VNode`，在内部组件 `render()` 中调用并输出；
> - 每次渲染都会重新执行 `render` 回调，动态内容可响应式更新；
> - 已声明 `update:value` 事件（供 `v-model:value` 使用），当前为预留状态。

## 基础用法

<DemoBlock>
  <div style="display: flex; flex-direction: column; gap: 12px; align-items: flex-start;">
    <CbRenderComponent :render="renderInput" />
    <CbRenderComponent :render="renderTag" />
  </div>

<template #code>

```vue
<template>
  <CbRenderComponent :render="renderInput" />
</template>

<script setup lang="ts">
import { Input as TInput } from 'tdesign-vue-next'
import type { VNode } from 'vue'

// 注意：render 回调必须使用组件对象（h(TInput)），
// 字符串写法 h('t-input') 不会解析全局注册组件（会被当作原生元素）
const renderInput = (h: any): VNode =>
  h(TInput, { placeholder: 'render 函数渲染的输入框' })
</script>
```

</template>
</DemoBlock>

## 渲染 TDesign 组件

`render` 回调直接返回 TDesign 组件 VNode（**使用组件对象**，字符串组件名在 `h()` 中不会解析全局注册）：

<DemoBlock>
  <CbRenderComponent :render="(h) => h(TButton, { theme: 'primary' }, '渲染的按钮')" />

<template #code>

```vue
<script setup lang="ts">
import { Button as TButton } from 'tdesign-vue-next'

const renderBtn = (h: any) =>
  h(TButton, { theme: 'primary' }, '渲染的按钮')
</script>
```

</template>
</DemoBlock>

## API

### Props

| 属性 | 说明 | 类型 |
| --- | --- | --- |
| render | 渲染回调，返回要渲染的 VNode（接收 `h` 参数） | `(h: any) => VNode` |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:value | value 更新（配合 `v-model:value`） | `any` |

## 使用须知

1. **回调形式**：`render` 由组件内部以 `h` 调用，业务侧无需自行导入 `h`（类型层面可按 `(h: any) => VNode` 声明）；
2. **响应式**：`render` 每次渲染都会重新执行，依赖外部响应式变量时内容会随变化更新；
3. **组件名解析**：`h()` 中必须使用**组件对象**（如 `h(TInput)`）或 `resolveComponent('t-input')`——字符串写法 `h('t-input')` 在 Vue 3 手写渲染函数中不会被解析为全局注册组件，而是被当作原生自定义元素渲染（表现为空白/不生效）；
4. **v-model 转发**：当渲染的组件未自带 `onChange` / `onUpdate:value` 时，组件会自动补充并将值变化转发到 `emit('update:value')`，配合父组件 `v-model:value` 使用；若渲染组件自身已绑定 `onChange`，则尊重业务监听、不覆盖。
