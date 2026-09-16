---
title: 项目结构
description: CB UI 组件库 Monorepo 完整目录结构、脚本与指令大全、各包职责说明。
---

# 项目结构

本文档是 **CB UI 组件库工程** 的地图：目录放什么、每个脚本干什么、每个指令什么时候用。适合新人、老成员以及任何需要改这个仓库的自动化工具阅读。

## 一、仓库总览

`cb-ui-monorepo` 是 **pnpm workspace Monorepo**，一个仓库包含四个子包 + 文档站：

| 包 | 名称 | 职责 |
| --- | --- | --- |
| `packages/components` | `@cb-ui/components` | 组件库本体（44 个组件 + 构建/按需加载） |
| `packages/theme` | `@cb-ui/theme` | 设计 token：Sass 变量、Tailwind 预设、全局样式 |
| `packages/utils` | `@cb-ui/utils` | 通用工具函数（uid / debounce / deepClone 等） |
| `docs`（根级） | `docs` | VitePress 文档站（指南 / 组件示例 / PRD） |

> ⚠️ **注意**：文档站是根目录的 `docs/`（不是 `packages/` 下的目录）。workspace 成员见 `pnpm-workspace.yaml`（`packages/*` + `docs`）。

```
CBUi/
├── packages/                  # 子包（components / theme / utils）
│   ├── components/            # ★ 组件库本体
│   │   ├── src/               #   全部源码（44 个组件 + 基础设施）
│   │   ├── scripts/           #   extract-props.mjs 等
│   │   ├── vite.config.ts     #   ES/CJS/UMD 三格式构建 + d.ts 生成
│   │   └── package.json
│   ├── theme/                 # 设计 token
│   └── utils/                 # 工具函数
├── docs/                      # ★ 文档站（VitePress，根级）
│   ├── .vitepress/            #   config.ts 侧边栏/导航、主题、DemoBlock
│   ├── components/            #   44 个组件文档（.md，侧边栏自动扫描）
│   ├── guide/                 #   指南（介绍/快速上手/新组件开发/组件开发指南/常见问题/本文档）
│   ├── prd/                   #   4 篇产品与技术方案
│   ├── public/                #   静态资源
│   └── package.json
├── scripts/                   # 根级 Node 脚本（入口生成 / 脚手架 / 排障）
├── .changeset/                # Changesets 版本管理（已初始化，未接入发布流程）
├── coverage/                  # 单测覆盖率报告（git 忽略）
├── pnpm-workspace.yaml        # workspace 定义
├── vitest.config.ts           # 单测配置
├── tailwind.config.ts         # Tailwind 扫描与预设
├── tsconfig.json / tsconfig.base.json
├── .eslintrc.cjs / .prettierrc / .npmrc
└── package.json               # 根脚本入口
```

## 二、根目录关键文件

### 2.1 `pnpm-workspace.yaml`

定义 workspace 成员：`packages/*` 和 `docs`。新增子包放在 `packages/` 下即自动纳入。

### 2.2 `package.json`（根）

monorepo 根，**只放跨包脚本**（`pnpm -F <包名> xxx` 转发到子包）。完整脚本表见 [第三节](#三脚本与指令大全)。

### 2.3 TypeScript 配置

- `tsconfig.base.json`：所有包共享的基础配置（strict、ES2020、`jsxImportSource: vue`、`#/*` 路径别名等）。
- `tsconfig.json`（根）：只声明 `noEmit: true` + 继承 base。**不要删 noEmit** —— 没有它，根 `vue-tsc` 会因 `declaration: true` 把 `.d.ts` 写进源码目录，触发 `TS5055 无法写入 index.d.ts 会覆盖输入文件`。
- `packages/components/tsconfig.json`：组件包的类型检查范围（`src/**`，排除 `*.spec.ts`）。

### 2.4 `vitest.config.ts`（单测配置）

- 环境 `happy-dom`、全局模式、覆盖率 provider `v8`（输出 text/json/html）。
- 别名：`@cb-ui/*` 与 `#` 均指向 `packages/components/src`，和 vite/tsconfig 三处保持一致。

### 2.5 `tailwind.config.ts`

扫描 `docs/` 与 `packages/components/src` 下的文件生成工具类；引入 `packages/theme/src/tailwind.preset.js` 预设；关闭 `preflight`（不污染全局 reset）。
**注意**：content 路径必须用 `__dirname` 解析成绝对路径，否则 `pnpm -F docs build` 时（cwd 在 docs/）会扫描不到类名。

### 2.6 `.eslintrc.cjs`

ESLint 8 + TS + vue3-recommended + prettier。两个关键点：

- `no-explicit-any` / `no-unused-vars` 均为 **warn**（当前基线 **0 errors / 0 warnings**，`no-explicit-any` 147 条既有债务已于 2026-09 全部清理）。
- `overrides` 对 `**/*.cjs` 关闭 `no-require-imports` —— `scripts/*.cjs` 是故意用 CommonJS 写的 Node 工具，`require()` 是正常用法。

### 2.7 `.npmrc`

registry 指向 npmmirror 镜像。

### 2.8 `.changeset/`

Changesets 已初始化（`config.json` + `initial-release.md`），但**尚未接入发布流程**（无 `changeset` / `release` 脚本、无 CI 发布动作），属预留能力。

### 2.9 其他

- `coverage/`：`vitest run --coverage` 的输出目录（git 忽略，可随时重新生成）。

## 三、脚本与指令大全

> 所有命令在**项目根目录**执行。`-F` 是 pnpm 的 `--filter`，按包名转发。

### 3.1 根 `package.json` 脚本

| 命令 | 实际执行 | 作用 | 什么时候用 |
| --- | --- | --- | --- |
| `pnpm dev` | `pnpm -F docs dev` | 启动文档站开发服务器（默认 http://localhost:5173，局域网可访问） | 日常预览组件/指南 |
| `pnpm build` | `build:lib` + `build:docs` | 一次构建组件库产物 + 文档站静态站 | 发版前全量构建 |
| `pnpm build:lib` | `pnpm -F @cb-ui/components build` | 构建组件库（dist 下 ES/CJS/UMD + d.ts + style.css） | 单独构建组件库 |
| `pnpm build:docs` | `pnpm -F docs build` | 构建文档站静态站（dist/） | 单独构建文档站 |
| `pnpm preview` | `pnpm -F docs preview` | 本地预览构建后的文档站 | 检查 build:docs 产物 |
| `pnpm extract:props` | `pnpm -F @cb-ui/components extract:props` | 从组件 `types.ts` JSDoc 提取 API 文档到 `docs/.vitepress/generated/` | 改了组件 Props/Events/Slots 的 JSDoc 后 |
| `pnpm gen` | `node scripts/gen-component.mjs` | 交互式生成新组件（目录 5 文件 + 文档 + 自动刷入口） | **新增组件首选** |
| `pnpm gen:index` | `node scripts/generate-index.mjs` | 扫描组件目录，自动重写全量入口 `src/index.ts` | 手动新增/删除组件后，或入口与源码不一致时 |
| `pnpm check` | `check:type && check:lint && check:test && check:build` | **一键质量门**：类型 → lint → 单测 → 构建，全过才算绿 | 提交/合并前、CI |
| `pnpm check:type` | `vue-tsc --noEmit -p packages/components/tsconfig.json` | 组件包类型检查（0 error 即过） | 单查类型 |
| `pnpm check:lint` | `eslint packages scripts --ext .vue,.ts,.tsx,.cjs,.mjs` | 全量 lint（0 errors 即过，warnings 不阻断） | 单查规范 |
| `pnpm check:test` | `vitest run` | 跑全部单测（当前 47 files / 262 tests） | 单查测试 |
| `pnpm check:build` | `pnpm build:lib` | 重新构建组件库 | 单查构建 |
| `pnpm test` | `vitest run` | 等价 `check:test` | 同上 |
| `pnpm test:watch` | `vitest` | 监听模式，改代码自动重跑 | 写单测时 |
| `pnpm test:coverage` | `vitest run --coverage` | 跑单测 + 覆盖率报告（当前基线 lines 77.77%） | 看覆盖率 |
| `pnpm lint` | `eslint . --ext .vue,.ts,.tsx --fix` | 全量 lint 并自动修复 | 想顺手修 warnings |
| `pnpm format` | `prettier --write "**/*.{vue,ts,tsx,scss,css,md,json}"` | Prettier 全量格式化 | 提交前统一格式 |

### 3.2 `packages/components/package.json` 脚本

| 命令 | 作用 |
| --- | --- |
| `pnpm -F @cb-ui/components build` | Vite library 模式构建（ES/CJS/UMD 三格式 + d.ts + style.css），即根的 `build:lib` |
| `pnpm -F @cb-ui/components dev` | 组件库监听构建（改源码自动重编 dist） |
| `pnpm -F @cb-ui/components extract:props` | 即根的 `extract:props`，生成 API 文档片段 |

### 3.3 `docs/package.json` 脚本

| 命令 | 作用 |
| --- | --- |
| `pnpm -F docs dev` | VitePress 开发服务器（根 `pnpm dev` 即此命令） |
| `pnpm -F docs build` | 构建文档站静态站 |
| `pnpm -F docs preview` | 预览静态站 |
| `pnpm -F docs extract:api` | 调 `@cb-ui/components extract:props` 刷新 API 片段 |

### 3.4 `scripts/` 根级脚本逐个说明

| 文件 | 触发命令 | 干什么 | 状态 |
| --- | --- | --- | --- |
| `generate-index.mjs` | `pnpm gen:index` | 扫描 `packages/components/src/` 下有 `index.ts` 的目录（排除 resolver 等），正则提取组件名与类型名，**整文件重写** `src/index.ts`（含 `CBUI.install` 全量注册 + click-outside 指令 + iconfont 初始化） | ✅ 正式工具，`gen` 脚手架会自动调它 |
| `gen-component.mjs` | `pnpm gen` | 传 `<英文名> [中文名]`（如 `pnpm gen modal 模态框`），一键生成：`types.ts / index.ts / style.scss / Xxx.vue / docs 文档`，并自动执行 gen:index | ✅ 正式工具，新增组件唯一推荐入口 |

### 3.5 `packages/components/scripts/extract-props.mjs`

`pnpm extract:props` 的实际实现。扫描各组件目录的 `types.ts`，解析 JSDoc（`@default`、描述）与 TS 接口（Props/Emits/Slots），生成 `docs/.vitepress/generated/<组件>-api.md` 片段。**生成物已 git 忽略**，文档页通过 VitePress `@include` 语法引用（见 `docs/.vitepress/config.ts` 注释）。

### 3.6 单测常用指令

```bash
# 跑单个组件的测试
pnpm check:test packages/components/src/upload

# 单组件 + 覆盖率
npx vitest run packages/components/src/upload --coverage

# 按测试名过滤（只跑含 "zip" 的用例）
npx vitest run packages/components/src/upload -t "zip"

# 监听模式只盯一个组件
npx vitest packages/components/src/time-select
```

## 四、`packages/components` 详解（组件库本体）

### 4.1 `src/` 目录约定

```
src/
├── <组件目录>/                # 44 个组件，每个目录 5 个标准文件：
│   ├── Xxx.vue                #   组件本体（defineOptions name: CbXxx）
│   ├── index.ts               #   导出组件 + 类型（gen:index 依赖它的 export 格式）
│   ├── types.ts               #   XxxProps / XxxEmits / XxxSlots 接口（JSDoc 被 extract-props 解析）
│   ├── style.scss             #   组件样式（可选）
│   └── Xxx.spec.ts            #   单元测试（Vitest + happy-dom）
├── index.ts                   # ★ 全量入口（gen:index 自动生成，勿手改）
├── resolver.ts                # CBUIResolver：配合 unplugin-vue-components 按需自动引入
├── api/index.ts               # serviceManager（HTTP 服务接口，业务方应覆盖）
├── config/
│   ├── api.ts                 # serviceManager shim/mock：让组件库/文档站能编译 CbImageSecret（getFileTempUrl 直接回传路径）
│   ├── iconfont.js / .d.ts    # iconfont 脚本与类型
├── directives/clickOutside.ts # v-click-outside 指令（index.ts 全量注册）
├── types/                     # 全局 d.ts（shims-vue、assets、unplugin-vue-components）
├── utils/                     # 内部工具：alphaBgColor.ts、useDownLoad.ts
└── assets/
    ├── iconfont/initIconfont.ts   # 自动初始化 iconfont SVG Sprite（install 时调用）
    └── images/                    # pdf.png、file.svg 等静态资源
```

### 4.2 组件目录标准结构（以 `button` 为例）

```
button/
├── Button.vue      # defineOptions({ name: 'CbButton' })，模板 + script setup
├── index.ts        # export { Button }; export type {...}; export default Button
├── types.ts        # ButtonProps / ButtonEmits / ButtonSlots（带 JSDoc）
├── style.scss      # 组件样式（Sass 变量自动注入）
└── Button.spec.ts  # 单元测试
```

**命名铁律**（`gen` 脚手架自动遵守）：
- 目录名：kebab-case（`date-range-confirm-picker`）
- 组件文件：PascalCase（`DateRangeConfirmPicker.vue`）
- 组件注册名：`Cb` + PascalCase（`CbDateRangeConfirmPicker`）
- gen:index 只识别 `export { Xxx }`（第一个）与 `export type { ... }`，**index.ts 格式不要自创**，否则入口会漏导出。

### 4.3 构建配置 `vite.config.ts`

- `vite-plugin-dts`：生成 `.d.ts` 到 `dist/`（`entryRoot: src`、`outDir: dist`，避免污染 src）。
- 别名：`#` → `src`、`@cb-ui/utils` → `packages/utils/src`、`@cb-ui/theme` → `packages/theme`（注意不带 src，保证 `@cb-ui/theme/src/variables` 可解析）。
- SCSS：`additionalData` 自动注入 `@use "@cb-ui/theme/src/variables" as *`，组件里无需手动 `@use`。
- 构建：`external: ['vue']`，输出 `index.es.js / index.cjs.js / index.umd.js` + `style.css`。
- 已知噪音（不影响产物）：lightningcss 对 `:deep` 的提示、pdfjs-dist 的 eval 提示、vite-plugin-dts 对模板 `$slots` 类型推断的报错输出——均为既有状态。

### 4.4 `package.json` 的 exports 亮点

```jsonc
".":            { "import": "./dist/index.es.js", "require": "./dist/index.cjs.js", "types": "./dist/index.d.ts" },
"./dist/style.css": "./dist/style.css",
"./button":     { "import": "./src/button/index.ts", "types": "./src/button/types.ts" },  // 子路径按需引用（走源码）
"./resolver":   { "import": "./src/resolver.ts", "types": "./src/resolver.ts" }
```

## 五、`packages/theme` 与 `packages/utils`

### 5.1 theme（`@cb-ui/theme`）

```
src/
├── index.css          # 全局样式入口（main 字段）
├── variables.scss     # ★ 设计 token（颜色/间距/圆角等），组件 SCSS 自动注入
└── tailwind.preset.js # Tailwind 预设（色板等），tailwind.config.ts 引用
```

### 5.2 utils（`@cb-ui/utils`）

`src/index.ts` 导出：`uid`（唯一 ID）、`isEmpty`、`debounce`、`throttle`、`deepClone`、`camelToKebab`、`kebabToCamel`。组件库内部工具（`alphaBgColor`、`useDownLoad`）则放在 `components/src/utils/`，与公共 utils 分离。

## 六、`docs/` 文档站详解

```
docs/
├── index.md                      # 首页
├── package.json                  # VitePress 依赖与脚本
├── postcss.config.cjs            # Tailwind + autoprefixer
├── .vitepress/
│   ├── config.ts                 # ★ 导航/侧边栏/主题/别名/SCSS 注入（见下）
│   ├── components/DemoBlock.vue  # 组件示例展示块（<DemoBlock>）
│   ├── theme/                    # 自定义主题（index.ts、style.scss、tailwind.css）
│   ├── generated/                # extract-props 生成的 API 片段（git 忽略）
│   └── canvas-stub.js            # pdfjs-dist 的 canvas Node 端引用 stub
├── components/*.md               # 44 个组件文档（frontmatter title 用于侧边栏显示）
├── guide/*.md                    # 介绍 / 快速上手 / 新组件开发 / 组件开发指南 / 常见问题 / 本文档
├── prd/*.md                      # PRD + 技术选型 + Props 提取方案 + 文档结构说明
└── public/                       # logo、demo 资源
```

### 6.1 侧边栏自动分类机制（`config.ts`）

- `getComponentSidebarItems()` 扫描 `docs/components/*.md`，从 frontmatter `title` 取显示名。
- 三个集合决定归类：
  - `MEDIA_TOOL_COMPONENTS`（6 个）→「媒体与工具」
  - `BUSINESS_COMPONENTS`（13 个）→「业务组件」
  - 其余 →「基础组件」，再按 `BASE_SUBGROUPS` 四个子分组（按钮与操作 / 输入与选择 / 数据展示 / 布局与容器）归类；**未登记进任何子分组的基础组件自动进「未分组」兜底区**。
- **新增组件文档后，必须在 `BASE_SUBGROUPS` / `MEDIA_TOOL` / `BUSINESS` 之一登记**，否则会落进「未分组」。
- ⚠️ 改 `config.ts` 或新增/删除 `.md` 后，**必须重启 dev server** 才生效（VitePress 不热拾取）。

### 6.2 API 文档自动生成链路

```
组件 types.ts（写 JSDoc）
   → pnpm extract:props（extract-props.mjs）
   → docs/.vitepress/generated/<组件>-api.md
   → 组件文档页 <!-- @include: ./.vitepress/generated/<组件>-api.md -->
```

## 七、常用开发流程速查

| 想做什么 | 执行 |
| --- | --- |
| 预览文档站 | `pnpm dev` |
| 新增一个组件 | `pnpm gen <英文名> <中文名>` → 填业务逻辑 → 写 spec → `pnpm check` |
| 手动加/删组件目录后刷新入口 | `pnpm gen:index` |
| 改了组件的 Props JSDoc | `pnpm extract:props`（文档页自动 @include） |
| 提交前验证 | `pnpm check`（type + lint + test + build 一键） |
| 看覆盖率 | `pnpm test:coverage` |
| 单独测试某个组件 | `pnpm check:test packages/components/src/<组件>` |
| 全量格式化 | `pnpm format`（或 `pnpm lint` 顺带修 warnings） |
