---
title: Copy 复制
description: 点击图标复制文本到剪贴板。
---

# Copy 复制

点击图标将指定文本复制到剪贴板，复制成功后弹出提示。

## 基础用法

通过 `copy-text` 指定要复制的文本内容，点击图标即可复制。

<DemoBlock>
  <CbCopy copy-text="这是一段被复制的文本" />

<template #code>

```vue
<template>
  <CbCopy copy-text="这是一段被复制的文本" />
</template>
```

  </template>
</DemoBlock>

## 自定义成功提示

通过 `copy-success-text` 自定义复制成功后的提示文案。

<DemoBlock>
  <CbCopy copy-text="自定义提示内容" copy-success-text="已复制到剪贴板" />

<template #code>

```vue
<template>
  <CbCopy copy-text="自定义提示内容" copy-success-text="已复制到剪贴板" />
</template>
```

  </template>
</DemoBlock>

## 使用前提

组件内部依赖以下能力，使用前请确保已配置：

1. **CbIcon**：组件用 `CbIcon` 渲染复制图标（图标名 `fuzhi`）。
   - 全量引入：`app.use(CBUI)` 后 CbIcon 自动注册，CbCopy 也会自动注入 CbIcon。
   - 按需加载：CbCopy 在内部幂等注入 CbIcon 到全局，无需额外处理。
2. **iconfont symbol**：项目需引入 iconfont 文件，且包含 `icon-fuzhi` 图标。
3. **TDesign MessagePlugin**：复制成功提示基于 TDesign 的 `MessagePlugin`，
   需确保已注册 TDesign（`app.use(TDesign)`）。

## API

### Props

| 属性              | 说明                 | 类型     | 默认值     |
| ----------------- | -------------------- | -------- | ---------- |
| copy-text         | 要复制的文本内容     | `string` | -（必填）  |
| copy-success-text | 复制成功后的提示文案 | `string` | '复制成功' |
