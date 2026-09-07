---
title: ImageSecret 密钥图片
description: 根据业务文件路径获取临时 URL 并渲染图片。
---

# ImageSecret 密钥图片

根据传入的 `temp-url`（业务文件路径或 HTTP 链接）获取可访问的临时 URL 并渲染 `<img>`。当传入的是 HTTP 链接时直接使用，否则通过 `serviceManager` 获取临时 URL。

## 基础用法

传入 HTTP 链接直接渲染图片。

<DemoBlock>
  <CbImageSecret temp-url="https://picsum.photos/200/120" alt="示例图片" style="width: 200px; height: 120px;" />

<template #code>

```vue
<template>
  <CbImageSecret temp-url="https://picsum.photos/200/120" alt="示例图片" style="width: 200px; height: 120px;" />
</template>
```

  </template>
</DemoBlock>

## 使用前提

组件内部依赖以下能力，使用前请确保已配置：

1. **serviceManager**：组件通过 `import { serviceManager } from '#/config/api'` 获取 HTTP 客户端，
   业务方需在项目中提供该模块，并实现 `getHttp().getFileTempUrl(filePath)` 方法。
   - 文档站和组件库 build 时使用 `config/api.ts` 中的 mock（直接回传路径）。
   - 业务项目中应提供真实的 `serviceManager` 覆盖该 mock。
2. **Vite alias**：项目 `vite.config.ts` 需配置 `#` → 组件库 `src` 目录（或业务 `src` 目录）。
3. **tsconfig paths**：`tsconfig.json` 需配置 `"#/*": ["packages/components/src/*"]`（或业务路径）。

## API

### Props

| 属性     | 说明                                       | 类型     | 默认值   |
| -------- | ------------------------------------------ | -------- | -------- |
| temp-url | 图片临时路径或 HTTP 链接（必填）           | `string` | -（必填）|

### Attrs

组件使用 `v-bind="$attrs"` 透传所有原生属性（如 `alt`、`class`、`style` 等）给 `<img>` 标签。
