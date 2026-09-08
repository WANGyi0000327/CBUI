---
title: CbStatusTag 状态标签
---

<script setup>
const typeList = [
  { id: 1, name: '启用', color: '#00A870', value: 'on' },
  { id: 2, name: '停用', color: '#D54941', value: 'off' },
  { id: 3, name: '待处理', color: '#ED7B2F', value: 'pending' },
]
</script>

# CbStatusTag 状态标签

基于 TDesign `t-tag` 封装的状态标签：通过 `typeList` 配置状态与颜色映射，按 `status` 匹配展示标签（tag 模式）或纯文本（text 模式），支持圆点、图标插槽与自定义样式。

## 基础用法（tag 模式）

<DemoBlock>
  <div style="display: flex; gap: 12px; align-items: center;">
    <CbStatusTag :type-list="typeList" :status="1" />
    <CbStatusTag :type-list="typeList" :status="'off'" />
    <CbStatusTag :type-list="typeList" :status="'pending'" />
  </div>

<template #code>

```vue
<template>
  <CbStatusTag :type-list="typeList" :status="1" />
  <CbStatusTag :type-list="typeList" :status="'off'" />
</template>

<script setup lang="ts">
const typeList = [
  { id: 1, name: '启用', color: '#00A870', value: 'on' },
  { id: 2, name: '停用', color: '#D54941', value: 'off' },
]
</script>
```

</template>
</DemoBlock>

## 圆点模式与文本模式

`dot` 显示前置圆点；`showType="text"` 输出纯文本（颜色取自状态配置）：

<DemoBlock>
  <div style="display: flex; gap: 16px; align-items: center;">
    <CbStatusTag :type-list="typeList" :status="1" dot />
    <CbStatusTag :type-list="typeList" :status="1" show-type="text" />
    <CbStatusTag :type-list="typeList" :status="99" />
  </div>

<template #code>

```vue
<template>
  <CbStatusTag :type-list="typeList" :status="1" dot />
  <CbStatusTag :type-list="typeList" :status="1" show-type="text" />
  <CbStatusTag :type-list="typeList" :status="99" />
</template>
```

</template>
</DemoBlock>

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| typeList | 状态配置列表（按 id / value 匹配 status） | `tagType[]` | `[]` |
| status | 当前状态值 | `string \| number` | `''` |
| tagStyle | 标签自定义样式 | `Record<string, any>` | `{}` |
| size | 标签尺寸 | `string` | `'large'` |
| showType | 展示形式 | `'tag' \| 'text'` | `'tag'` |
| dot | 是否显示前置圆点 | `boolean` | — |

### tagType

| 属性 | 说明 | 类型 |
| --- | --- | --- |
| id | 状态 id（匹配 status） | `string \| number` |
| name | 状态名称 | `string` |
| color | 状态颜色 | `string` |
| label | 状态标签（name 的备选） | `string` |
| value | 状态值（匹配 status，可与 id 二选一） | `boolean \| string \| number` |
| variant | t-tag 变体 | `string \| 'dark'` |

### Slots

| 插槽 | 说明 |
| --- | --- |
| tagIcon | 标签图标（有值时标签左侧显示） |
| name / default | 自定义内容（作用域插槽，参数为当前匹配的 `tagType`） |
| tagSufix | 标签后缀内容 |
