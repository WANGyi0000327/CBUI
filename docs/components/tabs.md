---
title: Cbtabs 标签页切换
---

<script setup>
import { ref } from 'vue'

const type_tab = [
  { id: 1, label: '全部', value: 0 },
  { id: 2, label: '启用', value: 1 },
  { id: 3, label: '停用', value: 2 },
]
const current = ref(1)
</script>

# Cbtabs 标签页切换

基于 `t-radio-group`（`variant="primary-filled"`）封装的标签页切换组件：`v-model` 绑定当前选中 id，切换时触发 `tab_chk` 事件。适用于列表页顶部状态筛选等场景。

## 基础用法

<DemoBlock>
  <Cbtabs v-model="current" :type_tab="type_tab" @tab-chk="(id) => (current = id)" />
  <div style="margin-top: 12px; color: #666">当前选中 id：{{ current }}</div>

<template #code>

```vue
<template>
  <Cbtabs v-model="current" :type_tab="type_tab" @tab-chk="handleTabChk" />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const type_tab = [
  { id: 1, label: '全部', value: 0 },
  { id: 2, label: '启用', value: 1 },
  { id: 3, label: '停用', value: 2 },
]
const current = ref(1)

const handleTabChk = (id: number | string) => {
  current.value = id
}
</script>
```

</template>
</DemoBlock>

> 组件注册名为 **Cbtabs**（非标准 Cb 前缀格式），模板中使用 `<Cbtabs>`（或 `<cbtabs>`）。
>
> ⚠️ prop 名为 **`type_tab`（下划线）**，传参必须写 `:type_tab="..."`；写成 `:type-tab` 会匹配不到 props，按钮不会渲染（静默透传为 attr）。

## API

### Props

| 属性     | 说明            | 类型               | 默认值 |
| -------- | --------------- | ------------------ | ------ |
| type_tab | 标签页配置列表  | `typeTab[]`        | `[]`   |
| v-model  | 当前选中标签 id | `number \| string` | `-`    |

### typeTab

| 属性  | 说明                                               | 类型     |
| ----- | -------------------------------------------------- | -------- |
| id    | 标签 id（radio-button 的 value 与 v-model 绑定值） | `number` |
| label | 标签文案                                           | `string` |
| value | 标签关联值（业务预留）                             | `number` |

### Events

| 事件    | 说明                                   | 参数                     |
| ------- | -------------------------------------- | ------------------------ |
| tab_chk | 切换标签时触发（点击当前选中项不触发） | `(id: number \| string)` |

### Slots

| 插槽  | 说明                                          |
| ----- | --------------------------------------------- |
| value | 标签内容扩展（作用域插槽，参数为当前 `item`） |
