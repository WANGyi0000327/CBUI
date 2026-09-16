---
title: 快速上手
---

# 快速上手

本节介绍如何在项目中使用 CB UI，以及本地开发环境如何搭建。

::: tip 说明
CB UI 是基于 **TDesign** 二次封装的组件库，底层依赖 `tdesign-vue-next`。组件代码可直接复制到项目中使用，无需发布 npm 包。
:::

---

## 一、环境要求

| 依赖             | 版本要求  | 说明                      |
| ---------------- | --------- | ------------------------- |
| Node.js          | >= 18.0.0 | 运行时                    |
| pnpm             | >= 9.0.0  | 包管理器（monorepo 必需） |
| Vue              | ^3.4.0    | 组件运行框架              |
| TDesign Vue Next | ^1.16.1   | 底层组件库                |

---

## 二、本地开发（运行文档站）

```bash
# 1. 克隆仓库
git clone <仓库地址>
cd cb-ui

# 2. 安装依赖（pnpm workspace 一次性安装全部包）
pnpm install

# 3. 启动文档站
pnpm dev

# 访问 http://localhost:5173
```

> **注意**：Windows 下 `pnpm dev` 需整条命令运行（`cmd /c "cd /d <项目根> && pnpm dev"`），PowerShell 对 `&&` 支持不稳定。

---

## 三、在业务项目中使用

### 方式一：复制组件源码（推荐，灵活）

CB UI 组件不依赖 `@cb-ui/components` 包发布，直接复制源码即可使用：

**步骤 1：安装底层依赖**

```bash
pnpm add tdesign-vue-next@^1.16.1
```

**步骤 2：复制组件目录**

从 `packages/components/src/<组件名>/` 复制整个目录到业务项目：

```
your-project/
└── src/
    └── components/
        └── cb-ui/
            ├── button/            # 组件目录（含 Button.vue / types.ts / index.ts / style.scss）
            ├── status-tag/
            └── index.ts           # 按需汇总导出
```

**步骤 3：处理主题变量**

组件样式基于 `packages/theme/src/variables.scss`，复制到业务项目后引入：

```scss
// 业务项目 vite.config.ts 或全局样式入口
@use '你的路径/variables' as *;
```

或使用 Tailwind preset（`packages/theme/src/tailwind.preset.js`）保持设计 token 一致。

**步骤 4：业务依赖项处理（重要）**

部分业务组件依赖外部服务，组件库通过 `#/config/api` 的 `serviceManager` shim 提供本地 mock。业务项目需提供真实实现并配置别名：

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  resolve: {
    alias: {
      // 把 # 指向你的 serviceManager 实现目录
      '#': fileURLToPath(new URL('./src/config', import.meta.url)),
    },
  },
})
```

涉及依赖的组件：`CbUpload`（上传服务）、`CbFilepreview` / `CbFilePreviewV2` / `CbImageSecret`（临时 URL 服务）、`CbVoiceToText`（转写服务）等业务组件。

**步骤 5：直接使用**

```vue
<template>
  <CbButton type="primary">主要按钮</CbButton>
  <CbStatusTag :type-list="typeList" status="success" />
</template>

<script setup lang="ts">
import CbButton from '@/components/cb-ui/button'
import CbStatusTag from '@/components/cb-ui/status-tag'
</script>
```

### 方式二：按需自动引入（unplugin-vue-components）

组件库提供 `CBUIResolver`（`packages/components/src/resolver.ts`），配合 `unplugin-vue-components` 自动导入：

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import Components from 'unplugin-vue-components/vite'
import { CBUIResolver } from '@/components/cb-ui/resolver'

export default defineConfig({
  plugins: [
    Components({
      resolvers: [
        CBUIResolver({
          prefix: 'Cb', // 前缀默认 'Cb'
          importStyle: true, // 自动引入 style.scss
        }),
      ],
    }),
  ],
})
```

配置后模板中直接使用 `<CbButton>`、`<CbPublicTable>`，无需手动 import。

### 方式三：通过 workspace 包引入

组件库包名为 `@cb-ui/components`（见 `packages/components/package.json`），在 monorepo 中可跨包引用：

```bash
pnpm add @cb-ui/components@workspace:*
```

```typescript
import { CbButton } from '@cb-ui/components'
import '@cb-ui/components/dist/style.css'
```

---

## 四、常用命令

| 命令                       | 作用              | 说明                                           |
| -------------------------- | ----------------- | ---------------------------------------------- |
| `pnpm dev`                 | 启动文档站        | 热更新，访问 5173                              |
| `pnpm build:docs`          | 构建文档站        | **先停 dev**（共用 `.temp` 目录）              |
| `pnpm build:lib`           | 构建组件库产物    | Vite library 模式 → `packages/components/dist` |
| `pnpm gen <name> [中文名]` | 一键生成新组件    | 目录 + 文件 + 文档 + 自动 gen:index            |
| `pnpm gen:index`           | 重生成全量入口    | 扫描 `src/` 下组件目录，勿手改 `index.ts`      |
| `pnpm test`                | 全量单测          | Vitest，47 files / 262 tests                   |
| `pnpm lint`                | ESLint 检查+修复  | 0 errors 基线                                  |
| `pnpm extract:props`       | 生成 API 表格草稿 | 输出到 `docs/.vitepress/generated/`            |

---

## 五、TypeScript 支持

组件库全部以 TypeScript 编写，复制组件或引入包后自动获得类型提示：

```ts
import type { ButtonProps } from '@/components/cb-ui/button'
import type { ConfigType, PageInfo } from '@/components/cb-ui/public-table'
```

类型检查：

```bash
npx vue-tsc --noEmit -p packages/components/tsconfig.json
```

---

## 六、常见问题速览

- **组件样式不生效** → 确认已引入 `tdesign-vue-next` 样式与 `variables.scss`
- **文档页表格不显示** → 检查父容器是否有高度（表格区 `flex-grow` 撑开）
- **build:docs 报 `document is not defined`** → 先停 `pnpm dev` 再构建
- **新增组件侧边栏没出现** → 确认登记到 `config.ts` 三集合 + 重启 dev

完整说明见 [常见问题](/guide/faq)。
