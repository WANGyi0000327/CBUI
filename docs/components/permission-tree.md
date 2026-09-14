---
title: CbPermissionTree 权限树
---

<script setup>
import { ref } from 'vue'

const treeData = [
  {
    key: '1',
    label: '系统管理',
    children: [
      {
        key: '1-1',
        label: '用户管理',
        children: [
          { key: '1-1-1', label: '新增用户' },
          { key: '1-1-2', label: '删除用户' },
        ],
      },
      { key: '1-2', label: '角色管理' },
    ],
  },
  {
    key: '2',
    label: '内容管理',
    children: [{ key: '2-1', label: '文章管理' }],
  },
]
// 级联选中 demo：v-model 绑定选中的 keys
const checkedKeys = ref(['1-1'])
// 自定义字段 demo：后端返回的字段名不同
const customKeyData = [
  {
    id: 'a',
    title: '数据权限',
    childList: [
      { id: 'a-1', title: '查看全部' },
      { id: 'a-2', title: '查看本人' },
    ],
  },
]
const customKeys = { value: 'id', label: 'title', children: 'childList' }
const customChecked = ref([])
</script>

# CbPermissionTree 权限树

基于自定义数据结构的配置化权限树：通过 `data` + `keys` 声明式渲染树节点，支持复选框勾选、父子级联、严格模式、禁用节点与选中项回显，`v-model` 双向绑定选中的 key 列表。

## 基础用法

`checkable` 开启复选框，`expandAll` 默认展开全部层级（不传则默认折叠，点击箭头图标展开）：

<DemoBlock>
  <div style="border: 1px solid var(--td-border-level-2-color); border-radius: 4px; padding: 16px; max-width: 560px;">
    <CbPermissionTree :data="treeData" checkable expand-all />
  </div>

<template #code>

```vue
<template>
  <CbPermissionTree :data="treeData" checkable expand-all />
</template>

<script setup lang="ts">
const treeData = [
  { key: '1', label: '系统管理', children: [
    { key: '1-1', label: '用户管理', children: [
      { key: '1-1-1', label: '新增用户' },
      { key: '1-1-2', label: '删除用户' },
    ]},
    { key: '1-2', label: '角色管理' },
  ]},
]
</script>
```

</template>
</DemoBlock>

## 级联选中

`v-model` 绑定选中的 key 列表：勾选父节点级联全选子孙，勾选子节点自动选中父节点（仅置选中，不自动取消）：

<DemoBlock>
  <div style="border: 1px solid var(--td-border-level-2-color); border-radius: 4px; padding: 16px; max-width: 560px;">
    <CbPermissionTree v-model="checkedKeys" :data="treeData" checkable expand-all />
    <p style="margin-top: 12px; font-size: 13px; color: #666;">选中 keys：{{ JSON.stringify(checkedKeys) }}</p>
  </div>

<template #code>

```vue
<template>
  <CbPermissionTree v-model="checkedKeys" :data="treeData" checkable expand-all />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const treeData = [
  { key: '1', label: '系统管理', children: [
    { key: '1-1', label: '用户管理', children: [
      { key: '1-1-1', label: '新增用户' },
      { key: '1-1-2', label: '删除用户' },
    ]},
    { key: '1-2', label: '角色管理' },
  ]},
]
const checkedKeys = ref<string[]>(['1-1'])
</script>
```

</template>
</DemoBlock>

## 禁用节点

`disabled` 传入不可勾选的 key 列表，禁用节点不参与选中与级联：

<DemoBlock>
  <div style="border: 1px solid var(--td-border-level-2-color); border-radius: 4px; padding: 16px; max-width: 560px;">
    <CbPermissionTree :data="treeData" :disabled="['1-1-1']" checkable expand-all />
  </div>

<template #code>

```vue
<template>
  <CbPermissionTree :data="treeData" :disabled="['1-1-1']" checkable expand-all />
</template>
```

</template>
</DemoBlock>

## 严格模式

`checkStrictly` 开启后只更新当前节点，不做父子级联：

<DemoBlock>
  <div style="border: 1px solid var(--td-border-level-2-color); border-radius: 4px; padding: 16px; max-width: 560px;">
    <CbPermissionTree :data="treeData" checkable expand-all check-strictly />
  </div>

<template #code>

```vue
<template>
  <CbPermissionTree :data="treeData" checkable expand-all check-strictly />
</template>
```

</template>
</DemoBlock>

## 自定义字段名

后端返回字段与默认 `key / label / children` 不同时，通过 `keys` 映射：

<DemoBlock>
  <div style="border: 1px solid var(--td-border-level-2-color); border-radius: 4px; padding: 16px; max-width: 560px;">
    <CbPermissionTree v-model="customChecked" :data="customKeyData" :keys="customKeys" checkable expand-all />
    <p style="margin-top: 12px; font-size: 13px; color: #666;">选中 keys：{{ JSON.stringify(customChecked) }}</p>
  </div>

<template #code>

```vue
<template>
  <CbPermissionTree v-model="customChecked" :data="customKeyData" :keys="customKeys" checkable expand-all />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const customKeyData = [
  { id: 'a', title: '数据权限', childList: [
    { id: 'a-1', title: '查看全部' },
    { id: 'a-2', title: '查看本人' },
  ]},
]
const customKeys = { value: 'id', label: 'title', children: 'childList' }
const customChecked = ref<string[]>([])
</script>
```

</template>
</DemoBlock>

## 仅展示选中项

`show-checked` 开启后只渲染选中节点及其祖先链（常用于回显已选权限摘要）：

<DemoBlock>
  <div style="border: 1px solid var(--td-border-level-2-color); border-radius: 4px; padding: 16px; max-width: 560px;">
    <CbPermissionTree v-model="checkedKeys" :data="treeData" checkable expand-all show-checked />
  </div>

<template #code>

```vue
<template>
  <CbPermissionTree v-model="checkedKeys" :data="treeData" checkable expand-all show-checked />
</template>
```

</template>
</DemoBlock>

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| data | 树数据（默认取 `key / label / children` 字段） | `BackendTreeNode[]` | `[]` |
| keys | 字段名映射（`value` / `label` / `children`） | `CustomTreeKey` | `{ value: 'key', label: 'label', children: 'children' }` |
| v-model | 选中的 key 列表 | `string[]` | `[]` |
| disabled | 禁用的节点 key 列表 | `(string \| number)[]` | `[]` |
| checkable | 是否显示复选框 | `boolean` | `false` |
| checkStrictly | 严格模式（不级联） | `boolean` | `false` |
| expandAll | 默认展开全部层级 | `boolean` | `false` |
| showChecked | 只渲染选中节点及其祖先链 | `boolean` | `false` |

### 类型

```ts
export interface CustomTreeKey {
  value: string
  label: string
  children: string
}
export interface BackendTreeNode {
  [key: string]: any
}
```
