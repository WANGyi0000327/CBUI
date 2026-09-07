---
title: OverflowInput 溢出省略输入框
---

<script setup>
const areaList = ['成都市', '高新区', '天府三街', '软件园C区', 'E区', 'F区', 'G区']
const tagList = ['前端开发', '组件库', 'Vue3', 'TypeScript', '工程化', '测试', '文档', 'CI/CD']
</script>

# OverflowInput 溢出省略输入框

用于展示一组长文本列表：最多展示前 `max` 项（超出部分省略号截断），并在末尾追加 **"等 N 个"** 计数后缀。视觉上复用 t-input 的边框、禁用底色等设计令牌，适合只读展示多个标签 / 地区 / 关联项的输入框场景。

> 特性说明：
> - 前 `max` 项以 `delimiter` 分隔拼接展示，超出部分不展示具体内容，仅显示计数。
> - `data.length <= max` 时不显示计数后缀。
> - 整块样式复刻 t-input 视觉（边框 / 圆角 / 高度 / 禁用底色），非交互只读。

## 基础用法

<DemoBlock>
  <CbOverflowInput :data="areaList" unit="个" />

<template #code>

```vue
<template>
  <CbOverflowInput :data="areaList" unit="个" />
</template>

<script setup lang="ts">
const areaList = ['成都市', '高新区', '天府三街', '软件园C区', 'E区', 'F区', 'G区']
</script>
```

</template>
</DemoBlock>

> 上方 `areaList` 共 7 项，`max` 默认 5，因此展示前 5 项并显示"等2个"。

## 自定义分隔符与展示数量

通过 `delimiter` 修改分隔符、`max` 控制展示数量：

<DemoBlock>
  <div style="display: flex; flex-direction: column; gap: 12px; max-width: 420px;">
    <CbOverflowInput :data="tagList" delimiter="、" :max="3" unit="个" />
    <CbOverflowInput :data="tagList" :max="10" unit="个" />
  </div>

<template #code>

```vue
<template>
  <!-- 逗号分隔，只展示 3 项 -->
  <CbOverflowInput :data="tagList" delimiter="、" :max="3" unit="个" />
  <!-- 展示数量足够，不显示计数 -->
  <CbOverflowInput :data="tagList" :max="10" unit="个" />
</template>
```

</template>
</DemoBlock>

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| data | 文本项列表 | `string[]` | `[]` |
| max | 最多展示的项数，超出折叠为计数后缀 | `number` | `5` |
| delimiter | 项与项之间的分隔符 | `string` | `'/'` |
| unit | 计数后缀单位（如"个""家""款"） | `string` | `-` |

## 使用须知

1. **只读展示**：组件为纯展示，无输入交互；如需可交互的标签输入，可组合 `t-input` + 业务逻辑自行实现；
2. **计数语义**：计数 = `data.length - max`，仅当 `count > 0` 时显示"等 N {unit}"；`unit` 不传时显示"等 N"；
3. **样式依赖**：组件使用 TDesign 设计令牌（`--td-comp-size-m`、`--td-text-color-9` 等），需引入 TDesign 的样式变量（`tdesign.css` 或主题包）。
