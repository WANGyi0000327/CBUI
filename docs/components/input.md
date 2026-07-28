---
title: Input 输入框
---

# Input 输入框

通过鼠标或键盘输入字符。

## 基础用法

<DemoBlock>
  <CbInput v-model="value" placeholder="请输入内容" />

  <template #code>

```vue
<template>
  <CbInput v-model="value" placeholder="请输入内容" />
</template>

<script setup>
import { ref } from 'vue'
const value = ref('')
</script>
```

  </template>
</DemoBlock>

## 尺寸

<DemoBlock>
  <CbInput size="small" placeholder="小尺寸" />
  <CbInput size="medium" placeholder="中等尺寸" />
  <CbInput size="large" placeholder="大尺寸" />

  <template #code>

```vue
<template>
  <CbInput size="small" placeholder="小尺寸" />
  <CbInput size="medium" placeholder="中等尺寸" />
  <CbInput size="large" placeholder="大尺寸" />
</template>
```

  </template>
</DemoBlock>

## 可清空

使用 `clearable` 属性显示清除按钮。

<DemoBlock>
  <CbInput v-model="clearValue" placeholder="输入后可清除" clearable />

  <template #code>

```vue
<template>
  <CbInput v-model="value" placeholder="输入后可清除" clearable />
</template>

<script setup>
import { ref } from 'vue'
const value = ref('')
</script>
```

  </template>
</DemoBlock>

## 禁用与只读

<DemoBlock>
  <CbInput disabled placeholder="禁用状态" />
  <CbInput readonly placeholder="只读状态" />

  <template #code>

```vue
<template>
  <CbInput disabled placeholder="禁用状态" />
  <CbInput readonly placeholder="只读状态" />
</template>
```

  </template>
</DemoBlock>

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| modelValue | 绑定值（v-model） | `string \| number` | '' |
| size | 输入框尺寸 | `'small' \| 'medium' \| 'large'` | 'medium' |
| disabled | 是否禁用 | `boolean` | false |
| readonly | 是否只读 | `boolean` | false |
| clearable | 是否显示清除按钮 | `boolean` | false |
| placeholder | 占位文本 | `string` | - |
| type | 原生 type 属性 | `string` | 'text' |
| maxlength | 最大输入长度 | `number` | - |
| prefixIcon | 输入框前置图标 | `string` | - |
| suffixIcon | 输入框后置图标 | `string` | - |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:modelValue | 输入值变化时触发 | `string` |
| input | 输入时触发 | `string` |
| blur | 失去焦点时触发 | `FocusEvent` |
| focus | 获得焦点时触发 | `FocusEvent` |
| keydown | 按下回车键时触发 | `KeyboardEvent` |
| clear | 点击清除按钮时触发 | - |

### Slots

| 插槽名 | 说明 |
| --- | --- |
| prefix | 输入框前置内容 |
| suffix | 输入框后置内容 |
