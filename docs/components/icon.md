---
title: Icon 图标
description: 基于 iconfont 的 SVG 图标组件。
---

# Icon 图标

基于 iconfont SVG sprite 的图标组件，需在项目中引入 iconfont symbol 文件。

## 基础用法

<DemoBlock>
  <CbIcon name="ruzhi" size="24px" color="#333" />

  <template #code>

```vue
<template>
  <CbIcon name="ruzhi" size="24px" color="#333" />
</template>
```

  </template>
</DemoBlock>

## 不同大小

<DemoBlock>
  <div style="display: flex; gap: 16px; align-items: center;">
    <CbIcon name="ruzhi" size="14px" color="#999" />
    <CbIcon name="ruzhi" size="20px" color="#666" />
    <CbIcon name="ruzhi" size="32px" color="#333" />
  </div>

  <template #code>

```vue
<template>
  <CbIcon name="ruzhi" size="14px" color="#999" />
  <CbIcon name="ruzhi" size="20px" color="#666" />
  <CbIcon name="ruzhi" size="32px" color="#333" />
</template>
```

  </template>
</DemoBlock>

## 使用前提

组件依赖 iconfont 的 symbol 定义，需在项目中引入 `iconfont.js`：

```html
<!-- 在 index.html 或入口文件中引入 -->
<script src="//at.alicdn.com/t/your_iconfont_id.js"></script>
```

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| name | 图标名称（不含 `icon-` 前缀） | `string` | - |
| size | 图标大小（CSS font-size 值） | `string` | - |
| color | 图标颜色（CSS 颜色值） | `string` | - |
