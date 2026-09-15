---
title: CurrencyInput 金额输入框
description: 基于 t-input-number 封装，附加金额范围校验与提示
---

<script setup>
import { ref } from 'vue'
// 各 demo 所需的响应式金额值
const price = ref(99.5)
const price2 = ref(50)
const price3 = ref(null)
const price4 = ref(88)
</script>

# CurrencyInput 金额输入框

基于 TDesign `t-input-number` 封装，自带金额范围校验：超过最大值提示并回填、低于最小值清空、可配置是否允许 0，内置"元"后缀。

## 基础用法

`v-model` 双向绑定数值，默认保留 2 位小数并显示"元"后缀。

<DemoBlock>
  <CbCurrencyInput v-model="price" />

<template #code>

```vue
<script setup>
import { ref } from 'vue'
const price = ref(99.5)
</script>

<template>
  <CbCurrencyInput v-model="price" />
</template>
```

  </template>
</DemoBlock>

## 范围限制

`max` / `min` 限制范围。blur 时若超过 max，默认提示并回填为 max；低于 min 则清空并提示。

<DemoBlock>
  <CbCurrencyInput v-model="price2" :max="1000" :min="10" text="金额" />

<template #code>

```vue
<template>
  <CbCurrencyInput v-model="price" :max="1000" :min="10" text="金额" />
</template>
```

  </template>
</DemoBlock>

## 禁止输入 0

`allow-input-zero=false` 时输入 0 会提示并清空。

<DemoBlock>
  <CbCurrencyInput v-model="price3" :allow-input-zero="false" />

<template #code>

```vue
<template>
  <CbCurrencyInput v-model="price" :allow-input-zero="false" />
</template>
```

  </template>
</DemoBlock>

## 隐藏元后缀

`is-show-suffix=false` 隐藏右侧"元"后缀。

<DemoBlock>
  <CbCurrencyInput v-model="price4" :is-show-suffix="false" />

<template #code>

```vue
<template>
  <CbCurrencyInput v-model="price" :is-show-suffix="false" />
</template>
```

  </template>
</DemoBlock>

## 使用前提

1. **TDesign**：组件内部用 `t-input-number`、`MessagePlugin`，需注册 TDesign（`app.use(TDesign)`）。
2. 无 CbIcon 依赖。

## API

### Props

| 属性               | 说明                            | 类型      | 默认值       |
| ------------------ | ------------------------------- | --------- | ------------ |
| decimal-places     | 小数位数                        | `number`  | 2            |
| max                | 最大值（blur 超过则提示/回填）  | `number`  | 9999999.99   |
| min                | 最小值（blur 低于则清空并提示） | `number`  | 0            |
| text               | 字段语义名（用于提示文案）      | `string`  | '价格'       |
| allow-input-zero   | 是否允许输入 0                  | `boolean` | true         |
| input-zero-message | 输入 0 时的提示文案             | `string`  | '不能输入0'  |
| placeholder        | 占位提示                        | `string`  | '请输入价格' |
| ishint             | 超过最大值时是否弹出提示        | `boolean` | true         |
| isassignment       | 超过最大值时是否自动回填为 max  | `boolean` | true         |
| is-show-suffix     | 是否显示后缀"元"                | `boolean` | true         |

### v-model

| 名称       | 说明               | 类型             |
| ---------- | ------------------ | ---------------- |
| modelValue | 当前金额值（双向） | `number \| null` |

### 实例方法（defineExpose）

| 方法  | 说明       | 签名                  |
| ----- | ---------- | --------------------- |
| focus | 聚焦输入框 | `() => Promise<void>` |
