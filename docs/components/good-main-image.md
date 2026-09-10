---
title: CbGoodMainImage 商品主图
---

<script setup>
import { ref } from 'vue'
</script>

# CbGoodMainImage 商品主图

基于 TDesign Image 的商品主图组件：`cover` 裁切居中展示图片，加载中显示 Loading，加载失败/无图时用渐变底图 + 商品名称兜底（名称按容器宽度自适应字号，最多两行、超长截断）。

## 基础用法

传入 `src` 显示图片；`name` 用于失败兜底文字；`width` / `height` 支持数字（自动转 px）或字符串。

<DemoBlock>
  <div style="padding: 16px 0; display: flex; gap: 16px; flex-wrap: wrap">
    <CbGoodMainImage src="/demo-img.jpg" name="示例商品主图" :width="120" :height="120" />
    <CbGoodMainImage name="无图商品展示名称" :width="120" :height="120" />
  </div>
  <p style="margin-top: 8px; font-size: 13px; color: #666">
    左：正常图片；右：模拟加载失败，显示渐变底 + 名称兜底。
  </p>

<template #code>

```vue
<template>
  <div style="display: flex; gap: 16px">
    <CbGoodMainImage src="/demo-img.jpg" name="示例商品主图" :width="120" :height="120" />
    <CbGoodMainImage name="无图商品展示名称" :width="120" :height="120" />
  </div>
</template>
```

</template>
</DemoBlock>

## 长名称兜底

名称最多显示 20 字，超出部分省略；字号基于容器宽度（`9.2cqw`）自适应，保证固定两行、不溢出。

<DemoBlock>
  <div style="padding: 16px 0">
    <CbGoodMainImage
      name="这是一个非常长的商品名称用来测试兜底文字的截断与两行显示效果"
      :width="160"
      :height="160"
    />
  </div>

<template #code>

```vue
<template>
  <CbGoodMainImage
    name="这是一个非常长的商品名称用来测试兜底文字的截断与两行显示效果"
    :width="160"
    :height="160"
  />
</template>
```

</template>
</DemoBlock>

## API

### Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| src | `string` | `''` | 图片地址（空/加载失败走兜底） |
| name | `string` | `''` | 商品名称，失败兜底文字（最多 20 字） |
| width | `string \| number` | `'100%'` | 容器宽度，数字自动转 px |
| height | `string \| number` | `'100%'` | 容器高度，数字自动转 px |

### 说明

- 图片 `fit="cover"` 居中裁切，圆角 2px。
- 失败兜底：渐变底图（组件内置 `default.png`）+ 白色名称文字；字号 `9.2cqw`（容器宽度百分位），两行 `height: 2.4em`，超长截断。
- 加载中显示 `t-loading`。
