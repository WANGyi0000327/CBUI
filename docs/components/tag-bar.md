---
title: CbTagBar 多标签栏
---

<script setup>
import { ref } from 'vue'

const activeTab = ref('/page-a')
const tabs = ref([
  { path: '/page-a', meta: { title: '页面A' } },
  { path: '/page-b', meta: { title: '页面B' } },
  { path: '/page-c', meta: { title: '页面C' } },
])

const handleJump = (tab) => {
  activeTab.value = tab.path
}
const handleClose = (path) => {
  tabs.value = tabs.value.filter((t) => t.path !== path)
  if (activeTab.value === path) activeTab.value = tabs.value[0]?.path || ''
}
const handleCloseOther = () => {
  tabs.value = tabs.value.filter((t) => t.path === activeTab.value)
}
</script>

# CbTagBar 多标签栏

基于 `t-tabs`（`theme="card"`）封装的**多标签导航栏**，常用于后台管理系统的顶部标签页：点击标签切换路由（`jump`）、关闭标签（`close`）、右键标签弹出菜单（关闭其他 / 刷新页面）。

## 基础用法

<DemoBlock>
  <CbTagBar
    v-model:active-tab="activeTab"
    :tabs="tabs"
    @jump="handleJump"
    @close="handleClose"
    @close-other="handleCloseOther"
  />

<template #code>

```vue
<template>
  <CbTagBar
    v-model:active-tab="activeTab"
    :tabs="tabs"
    @jump="handleJump"
    @close="handleClose"
    @close-other="handleCloseOther"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const activeTab = ref('/page-a')
const tabs = ref([
  { path: '/page-a', meta: { title: '页面A' } },
  { path: '/page-b', meta: { title: '页面B' } },
  { path: '/page-c', meta: { title: '页面C' } },
])

const handleJump = (tab) => {
  activeTab.value = tab.path
}
const handleClose = (path) => {
  tabs.value = tabs.value.filter((t) => t.path !== path)
  if (activeTab.value === path) activeTab.value = tabs.value[0]?.path || ''
}
const handleCloseOther = () => {
  tabs.value = tabs.value.filter((t) => t.path === activeTab.value)
}
</script>
```

</template>
</DemoBlock>

## 交互说明

- **点击标签**：触发 `jump` 事件（参数为当前 tab 对象），由父组件更新路由与 `activeTab`
- **关闭标签**：非第一个标签悬浮时显示关闭图标，点击触发 `close`（参数为 path）；仅剩一个标签时不可关闭
- **右键标签**：弹出上下文菜单（关闭其他 / 刷新页面），分别触发 `close-other` / `refresh`；点击菜单外部自动收起
- **激活态**：`activeTab` 与 `tab.path` 相等时标签高亮

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| activeTab | 当前激活的路由 path | `string` | `''` |
| tabs | 标签页数据列表 | `TagBarTab[]` | `[]` |

### TagBarTab

| 属性 | 说明 | 类型 |
| --- | --- | --- |
| path | 路由路径（标签唯一 key 与 value） | `string` |
| meta.title | 标签标题 | `string` |

> 组件为泛型组件 `generic="T extends Record<string, any>"`，`tabs` 接受任意满足 `{ path, meta: { title } }` 约束的数据结构。

### Events

| 事件 | 说明 | 参数 |
| --- | --- | --- |
| jump | 点击 / 右键标签时触发（切换路由） | `(tab: T)` |
| close | 点击关闭图标 | `(path: string)` |
| close-other | 右键菜单「关闭其他」 | `-` |
| refresh | 右键菜单「刷新页面」 | `-` |
