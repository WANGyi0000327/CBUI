---
title: OverLimitInputNumber 超限输入数字框
---

# OverLimitInputNumber 超限输入数字框

基于 **TDesign `t-input-number`** 二次开发的数字输入框，提供两种超限处理策略：**回滚**（`allowInputOverLimit=false` 时，输入超出 `min` / `max` 自动回滚到上一次有效值）与**截断**（`enableTruncation=true` 时，超出自动收敛到边界值）。

> 特性说明：
>
> - **回滚模式**：`allow-input-over-limit` 为 `false` 时，输入 `min` / `max` 范围外的数字不生效，自动恢复为上一次有效值。
> - **截断模式**：`enable-truncation` 为 `true` 时，超出 `min`（`min <= 0` 时）或 `max` 的值自动收敛到边界。
> - 输入为空字符串时保持为空，不会回填 `min`。
> - 具名插槽自动透传给 `t-input-number`。

## 基础用法

<DemoBlock>
  <CbOverLimitInputNumber style="width: 220px;" />

<template #code>

```vue
<template>
  <CbOverLimitInputNumber v-model="value" style="width: 220px;" />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref<number | string>('')
</script>
```

</template>
</DemoBlock>

## 超限回滚

`allow-input-over-limit="false"` 时，输入超出范围的值会被回滚，不生效：

<DemoBlock>
  <div style="display: flex; flex-direction: column; gap: 12px; max-width: 320px;">
    <CbOverLimitInputNumber
      :min="0"
      :max="100"
      :allow-input-over-limit="false"
      style="width: 220px;"
    />
    <div style="color: var(--td-text-color-secondary); font-size: 12px;">
      输入负数或大于 100 后失焦/回车，值会回滚到上一次有效值
    </div>
  </div>

<template #code>

```vue
<template>
  <!-- 输入超限（< 0 或 > 100）自动回滚 -->
  <CbOverLimitInputNumber v-model="value" :min="0" :max="100" :allow-input-over-limit="false" />
</template>
```

</template>
</DemoBlock>

## 截断模式

`enable-truncation` 开启时，超出边界的输入自动收敛：

<DemoBlock>
  <div style="display: flex; flex-direction: column; gap: 12px; max-width: 320px;">
    <CbOverLimitInputNumber
      :min="0"
      :max="10"
      :enable-truncation="true"
      style="width: 220px;"
    />
    <div style="color: var(--td-text-color-secondary); font-size: 12px;">
      输入超过 10 自动收敛为 10；min 为 0 时输入负数自动收敛为 0
    </div>
  </div>

<template #code>

```vue
<template>
  <!-- 输入超限自动截断到边界 -->
  <CbOverLimitInputNumber v-model="value" :min="0" :max="10" :enable-truncation="true" />
</template>
```

</template>
</DemoBlock>

## API

### Props

| 属性                | 说明                                                                                                                                                    | 类型               | 默认值      |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ | ----------- |
| v-model             | 绑定值                                                                                                                                                  | `number \| string` | `''`        |
| enableTruncation    | 是否开启截断模式（超出收敛到边界）                                                                                                                      | `boolean`          | `false`     |
| allowInputOverLimit | 是否允许输入超出限制；`false` 时超限回滚                                                                                                                | `boolean`          | `true`      |
| max                 | 最大值                                                                                                                                                  | `number`           | `Infinity`  |
| min                 | 最小值                                                                                                                                                  | `number`           | `-Infinity` |
| （其余属性）        | 通过 `v-bind="$attrs"` 透传给 [TDesign InputNumber](https://tdesign.tencent.com/vue-next/components/input-number)，如 `theme`、`size`、`placeholder` 等 | -                  | -           |

### Events

| 事件名            | 说明                                                              | 回调参数           |
| ----------------- | ----------------------------------------------------------------- | ------------------ |
| change            | 值变化（透传 t-input-number 的 change；截断模式下发出截断后的值） | `(value, context)` |
| update:modelValue | v-model 更新                                                      | `number \| string` |

### Slots

| 名称             | 说明                                                                     |
| ---------------- | ------------------------------------------------------------------------ |
| （全部具名插槽） | 自动透传给 `t-input-number`（如 `label`、`prefixIcon`、`suffixIcon` 等） |

## 使用须知

1. **前置依赖**：业务项目中必须 `app.use(TDesign)` 全局注册 TDesign，否则 `t-input-number` 无法渲染；
2. **回滚与截断互斥**：`allowInputOverLimit=false` 优先于 `enableTruncation`（回滚分支先判断）；
3. **截断细节**：`min <= 0` 时下界截断才生效（避免输入过程中无法输入部分数字）；`min > 0` 时仅做上界截断；
4. **空值语义**：清空输入时保持 `''`，不回填 `min`。
