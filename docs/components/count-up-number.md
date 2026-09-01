---
title: CountUpNumber 数字动画
description: 数字以动画方式平滑过渡展示，支持千分位、大数格式化
---

<script setup>
import { ref } from 'vue'
// 动态更新 demo 所需的响应式数值
const dynamicValue = ref(5000)
</script>

# CountUpNumber 数字动画

基于 [countup.js](https://github.com/inorganik/countUp.js) 封装，把数字以动画方式平滑过渡展示。组件只负责"把数字动画展示出来"，不耦合业务单位、颜色等页面语义，便于复用。

## 基础用法

传入 `value` 即可，数字会从 0 平滑过渡到目标值。

<DemoBlock>
  <CbCountUpNumber :value="8888" />

<template #code>

```vue
<template>
  <CbCountUpNumber :value="8888" />
</template>
```

  </template>
</DemoBlock>

## 大数格式化

`formatting` 开启后，超过 10000 的数字会自动转为 `w` 结尾（保留最多两位小数），动画过程中也会平滑切换格式。

<DemoBlock>
  <CbCountUpNumber :value="15000" formatting />

<template #code>

```vue
<template>
  <CbCountUpNumber :value="15000" formatting />
</template>
```

  </template>
</DemoBlock>

## 自定义动画配置

可通过 `duration`、`use-easing`、`use-grouping`、`separator`、`decimal` 调整动画与格式。下例关闭千分位、动画时长 3 秒。

<DemoBlock>
  <CbCountUpNumber :value="12345.67" :duration="3" :use-grouping="false" />

<template #code>

```vue
<template>
  <CbCountUpNumber :value="12345.67" :duration="3" :use-grouping="false" />
</template>
```

  </template>
</DemoBlock>

## 动态更新

`value` 变化时组件会自动触发过渡动画（从当前值平滑到新值）。

<DemoBlock>
  <CbCountUpNumber :value="dynamicValue" />
  <TButton @click="dynamicValue = Math.floor(Math.random() * 100000)">随机更新</TButton>

<template #code>

```vue
<script setup>
import { ref } from 'vue'
const dynamicValue = ref(5000)
</script>

<template>
  <CbCountUpNumber :value="dynamicValue" />
  <TButton @click="dynamicValue = Math.floor(Math.random() * 100000)">随机更新</TButton>
</template>
```

  </template>
</DemoBlock>

## 使用前提

1. **countup.js**：组件依赖 `countup.js`，已作为组件库 dependency 安装，无需额外处理。
2. 无 CbIcon / TDesign 依赖，纯 `<span>` 渲染，可在任何场景使用。

## API

### Props

| 属性         | 说明                                          | 类型      | 默认值  |
| ------------ | --------------------------------------------- | --------- | ------- |
| value        | 目标数值（必填），变化时触发过渡动画          | `number`  | -       |
| formatting   | 是否开启大数格式化（≥10000 转 `w`，最多 2 位小数） | `boolean` | false   |
| duration     | 动画时长（秒）                                | `number`  | 1.5     |
| use-easing   | 是否启用数字缓动                              | `boolean` | true    |
| use-grouping | 是否启用千分位分组                            | `boolean` | true    |
| separator    | 千分位分隔符                                  | `string`  | ','     |
| decimal      | 小数点符号                                    | `string`  | '.'     |
