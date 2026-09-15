---
title: CbTagImg 状态图标文本
---

<script setup>
const typeList = [
  { id: 1, name: '启用', color: '#00A870', textcolor: '#00A870', icon: 'zhengque', value: 'on' },
  { id: 2, name: '停用', color: '#D54941', textcolor: '#D54941', icon: 'cuowu', value: 'off' },
  { id: 3, name: '待处理', color: '#ED7B2F', textcolor: '#ED7B2F', icon: 'yiwen', value: 'pending' },
]
</script>

# CbTagImg 状态图标文本

按 `status` 从 `typeList` 匹配状态配置，展示**对应图标 + 彩色文本**；无 status 或未匹配时展示占位符 `-`。适用于表格列中紧凑展示状态（如启用/停用/待处理）。

## 基础用法

<DemoBlock>
  <div style="display: flex; gap: 20px; align-items: center;">
    <CbTagImg :type-list="typeList" :status="1" />
    <CbTagImg :type-list="typeList" :status="'off'" />
    <CbTagImg :type-list="typeList" :status="'pending'" />
    <CbTagImg :type-list="typeList" :status="99" />
    <CbTagImg />
  </div>

<template #code>

```vue
<template>
  <CbTagImg :type-list="typeList" :status="1" />
  <CbTagImg :type-list="typeList" :status="'off'" />
  <CbTagImg :type-list="typeList" :status="99" />
  <CbTagImg />
</template>

<script setup lang="ts">
const typeList = [
  { id: 1, name: '启用', color: '#00A870', textcolor: '#00A870', icon: 'zhengque', value: 'on' },
  { id: 2, name: '停用', color: '#D54941', textcolor: '#D54941', icon: 'cuowu', value: 'off' },
]
</script>
```

</template>
</DemoBlock>

## API

### Props

| 属性     | 说明                                      | 类型               | 默认值 |
| -------- | ----------------------------------------- | ------------------ | ------ |
| typeList | 状态配置列表（按 id / value 匹配 status） | `tagType[]`        | `[]`   |
| status   | 当前状态值                                | `string \| number` | `''`   |
| variant  | 变体（预留）                              | `string`           | `''`   |

### tagType

| 属性      | 说明                                      | 类型                          |
| --------- | ----------------------------------------- | ----------------------------- |
| id        | 状态 id（匹配 status）                    | `string \| number`            |
| name      | 状态名称                                  | `string`                      |
| color     | 图标颜色                                  | `string`                      |
| label     | 状态标签（name 的备选）                   | `string`                      |
| value     | 状态值（匹配 status，可与 id 二选一）     | `boolean \| string \| number` |
| icon      | 图标名（cb-icon name，取自库内 iconfont） | `string`                      |
| textcolor | 文本颜色                                  | `string`                      |

> 图标名必须是组件库 iconfont 项目中已存在的（如 `zhengque`、`cuowu`、`yiwen` 等），否则图标不显示。
