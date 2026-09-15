---
title: CbSearchFilter 筛选弹层
---

<script setup>
import { ref } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'

const visible = ref(false)
const filterNumber = ref(2)

const filterList = [
  { label: '关键词', name: 'keyword', type: 'input', placeholder: '请输入关键词' },
  {
    label: '状态',
    name: 'status',
    type: 'select',
    options: [
      { label: '启用', value: 1 },
      { label: '停用', value: 2 },
    ],
  },
  {
    label: '类型',
    name: 'kind',
    type: 'radio',
    options: [
      { label: '全部', value: 'all' },
      { label: '个人', value: 'personal' },
    ],
  },
  {
    label: '标签',
    name: 'tags',
    type: 'checkbox',
    options: [
      { label: '标签A', value: 'a' },
      { label: '标签B', value: 'b' },
    ],
  },
  { label: '创建时间', name: 'createTime', type: 'dateRangePicker' },
]

const onSubmit = (data) => {
  MessagePlugin.success(`提交：${JSON.stringify(data)}`)
}
const onReset = (data, type) => {
  MessagePlugin.info(type ? '已清空筛选' : '已重置为初始值')
}
</script>

# CbSearchFilter 筛选弹层

基于 TDesign `t-popup` + `t-form` 封装的筛选面板：点击"筛选"按钮弹出表单，通过 `list` 配置**动态渲染** input / select / radio / checkbox / dateRangePicker / cascader 字段，支持重置（还原初始值 / 清空）与提交校验。

## 基础用法

通过 `list` 声明字段，`filterNumber` 控制按钮上的数量角标，`v-model:visible` 控制弹层显隐：

<DemoBlock>
  <CbSearchFilter
    v-model:visible="visible"
    :list="filterList"
    :filter-number="filterNumber"
    @submit="onSubmit"
    @reset="onReset"
  />

<template #code>

```vue
<template>
  <CbSearchFilter
    v-model:visible="visible"
    :list="filterList"
    :filter-number="filterNumber"
    @submit="onSubmit"
    @reset="onReset"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'

const visible = ref(false)
const filterNumber = ref(2)

const filterList = [
  { label: '关键词', name: 'keyword', type: 'input', placeholder: '请输入关键词' },
  {
    label: '状态',
    name: 'status',
    type: 'select',
    options: [
      { label: '启用', value: 1 },
      { label: '停用', value: 2 },
    ],
  },
]

const onSubmit = (data: Record<string, any>) => {
  MessagePlugin.success(`提交：${JSON.stringify(data)}`)
}
</script>
```

</template>
</DemoBlock>

> 弹层面板中的"重置"还原为初始值（有 `formDataProp` 时还原其副本，否则清空为字段默认值）；`filterNumber > 0` 时按钮右侧显示数量角标和清除图标（点击角标上的 × 直接清空）。

## API

### Props

| 属性           | 说明                           | 类型                      | 默认值   |
| -------------- | ------------------------------ | ------------------------- | -------- |
| visible        | 弹层显隐（`v-model:visible`）  | `boolean`                 | `false`  |
| list           | 动态表单字段配置               | `FormItem[]`              | `[]`     |
| popupwidth     | 弹层内容宽度                   | `string`                  | `'auto'` |
| filterNumber   | 当前筛选条件数量               | `number`                  | `0`      |
| btnWidth       | 筛选按钮最小宽度               | `string`                  | —        |
| filterForm     | 初始表单数据                   | `Record<string, unknown>` | `{}`     |
| showTotal      | 是否显示合计（预留）           | `boolean`                 | `false`  |
| total          | 合计数量（预留）               | `number`                  | `0`      |
| destroyOnClose | 关闭时销毁弹层内容             | `boolean`                 | `false`  |
| formDataProp   | 表单初始数据（作为重置基准值） | `Record<string, unknown>` | —        |
| formRules      | t-form 校验规则                | `FormRules`               | —        |
| hide           | 是否隐藏按钮背景色             | `boolean`                 | `false`  |

### FormItem 字段配置

| 属性        | 说明                                   | 类型                                                                              |
| ----------- | -------------------------------------- | --------------------------------------------------------------------------------- |
| label       | 字段标签                               | `string`                                                                          |
| name        | 字段名（formData 的 key）              | `string`                                                                          |
| type        | 字段类型                               | `'input' \| 'select' \| 'radio' \| 'checkbox' \| 'dateRangePicker' \| 'cascader'` |
| placeholder | 占位符（input）                        | `string`                                                                          |
| options     | 选项（select/radio/checkbox/cascader） | `{ label, value }[]`                                                              |
| required    | 是否必填                               | `boolean`                                                                         |
| width       | 字段宽度                               | `string`                                                                          |
| config      | 透传 t-date-range-picker 配置          | `Record<string, unknown>`                                                         |
| multiple    | 是否多选（select/cascader）            | `boolean`                                                                         |
| keys        | 选项字段映射（select）                 | `Record<string, string>`                                                          |

### Events

| 事件名 | 说明                                   | 回调参数                                                      |
| ------ | -------------------------------------- | ------------------------------------------------------------- |
| reset  | 点击重置/清空时触发                    | `(data, type)` type 为 `false`（重置初始值）或 `true`（清空） |
| submit | 点击确定且校验通过时触发               | `(data)` 当前表单数据                                         |
| cancel | 关闭弹层时触发（预留，取消按钮已注释） | —                                                             |

### Expose

| 方法          | 说明                           |
| ------------- | ------------------------------ |
| validate      | 触发 t-form 校验，返回是否通过 |
| clearValidate | 清除校验状态                   |
