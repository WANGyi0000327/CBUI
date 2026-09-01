---
title: DateRangeConfirmPicker 日期范围确认选择器
description: 选定范围后需点"确定"才提交，点击外部自动回滚
---

<script setup>
import { ref } from 'vue'
// demo 所需的日期范围
const range = ref(['2024-01-01', '2024-01-31'])
const onChange = (v) => console.log('confirmed', v)
</script>

# DateRangeConfirmPicker 日期范围确认选择器

基于 TDesign `t-date-range-picker` 封装。核心行为：打开时备份当前值，**点击外部（取消）自动回滚到备份**，只有点击"确定"预设才真正提交 `change`，避免未确认就改动 `v-model`。

## 基础用法

`v-model` 绑定字符串数组（两个日期）。点击输入框打开面板，选择范围后点击底部"确定"才提交。

<DemoBlock>
  <CbDateRangeConfirmPicker v-model="range" @change="onChange" />

<template #code>

```vue
<script setup>
import { ref } from 'vue'
const range = ref(['2024-01-01', '2024-01-31'])
const onChange = (v) => console.log('confirmed', v)
</script>

<template>
  <CbDateRangeConfirmPicker v-model="range" @change="onChange" />
</template>
```

  </template>
</DemoBlock>

## 取消回滚

打开面板后点击组件外部（或再次点击输入框外部），面板关闭，`v-model` 回滚到打开时的值，不会触发 `change`。

## 使用前提

1. **TDesign**：组件内部用 `t-date-range-picker`，需注册 TDesign（`app.use(TDesign)`）。
2. **v-click-outside 指令**：组件模板使用 `v-click-outside`，该指令由 `CBUI.install` 自动全局注册，`app.use(CBUI)` 后即可使用，无需额外配置。
3. 无 CbIcon 依赖。

## API

### Props

该组件未定义自己的 props，所有属性通过 `$attrs` 透传给 `t-date-range-picker`（如 `mode`、`enable-time-picker`、`clearable` 等）。

### v-model

| 名称       | 说明               | 类型         |
| ---------- | ------------------ | ------------ |
| modelValue | 日期范围（双向）   | `string[]`   |

### Events

| 事件名 | 说明                         | 回调参数             |
| ------ | ---------------------------- | -------------------- |
| change | 点击"确定"预设时触发         | `(value: string[])` |
