---
title: NumericInput 数字输入框
---

# NumericInput 数字输入框

基于 **TDesign `t-input`** 二次开发的数字输入组件：输入过程实时格式化（过滤多余负号 / 小数点、截断小数位数），失焦时按 `min` / `max` **钳制**并**四舍五入**，`v-model` 绑定 `number | null | undefined`。

> 特性说明：
> - **输入即格式化**：多余的 `-` 只保留首位、小数点只保留一个、小数位实时截断到 `decimalPlaces`。
> - **失焦钳制**：超出 `max` / `min` 自动收敛到边界值，并按小数位四舍五入后回写。
> - 清空输入时 `v-model` 置为 `null`。

## 基础用法

默认保留 2 位小数，`v-model` 绑定数字：

<DemoBlock>
  <CbNumericInput placeholder="请输入数字" />

<template #code>

```vue
<template>
  <CbNumericInput v-model="value" placeholder="请输入数字" />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref<number | null | undefined>()
</script>
```

</template>
</DemoBlock>

## 小数位控制

通过 `decimal-places` 设置保留位数（`0` = 整数，不显示小数点）：

<DemoBlock>
  <div style="display: flex; flex-direction: column; gap: 12px; max-width: 320px;">
    <CbNumericInput :decimal-places="0" placeholder="整数（0 位小数）" />
    <CbNumericInput :decimal-places="3" placeholder="三位小数" />
  </div>

<template #code>

```vue
<template>
  <!-- 整数输入 -->
  <CbNumericInput :decimal-places="0" placeholder="整数" />
  <!-- 三位小数 -->
  <CbNumericInput :decimal-places="3" placeholder="三位小数" />
</template>
```

</template>
</DemoBlock>

## 范围限制

设置 `max` / `min`，失焦时自动钳制到边界：

<DemoBlock>
  <div style="display: flex; flex-direction: column; gap: 12px; max-width: 320px;">
    <CbNumericInput :max="100" placeholder="最大 100" />
    <CbNumericInput :min="0" placeholder="最小 0" />
  </div>

<template #code>

```vue
<template>
  <!-- 输入超过 100 失焦后自动变为 100 -->
  <CbNumericInput v-model="value" :max="100" />
  <!-- 输入负数失焦后自动变为 0 -->
  <CbNumericInput v-model="value2" :min="0" />
</template>
```

</template>
</DemoBlock>

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| v-model | 绑定值（数字或空） | `number \| null \| undefined` | `undefined` |
| decimalPlaces | 保留小数位数（`0`=整数） | `number` | `2` |
| max | 最大值，失焦时钳制 | `number` | `Infinity` |
| min | 最小值，失焦时钳制 | `number` | `-Infinity` |
| （其余属性） | 全部通过 `v-bind="$attrs"` 透传给 [TDesign Input](https://tdesign.tencent.com/vue-next/components/input)，如 `placeholder`、`disabled`、`size`、`clearable` 等 | - | - |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| blur | 失焦（已钳制并四舍五入） | - |
| change | 值变化（透传 t-input 的 change） | `number` |

## 使用须知

1. **前置依赖**：业务项目中必须 `app.use(TDesign)` 全局注册 TDesign，否则 `t-input` 无法渲染；
2. **输入格式**：组件会自动过滤非法负号与多余小数点，但不会拦截字母等其他字符（仅做数值格式化，校验由业务侧处理）；
3. **空值语义**：清空输入框时 `v-model` 置为 `null`，用于区分"未输入"与"0"。
