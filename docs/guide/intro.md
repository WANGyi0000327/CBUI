---
title: 介绍
---

# CB UI 介绍

CB UI 是一套**从业务项目沉淀而来**的前端组件库：基于 **TDesign** 二次封装，使用 **Vue 3 + TypeScript** 构建，以 **VitePress + TailwindCSS + Sass** 搭建文档站点，通过 **pnpm monorepo** 管理。

::: tip 核心定位
CB UI 不是从零开发的组件库，而是把业务项目（CRM_MASTER-toVite / sa-platform）中反复使用的组件源码**原样沉淀**进统一库：统一 `Cb` 前缀命名、统一文档与测试、三级分类管理，并保证"源码一字不改、只做最小必要修正"的落地原则。
:::

---

## 一、核心特性

- **业务源码沉淀**：组件均来自真实业务项目，代码按原样落地，只做构建/类型/功能所需的最小修正
- **基于 TDesign 二次封装**：底层使用 `tdesign-vue-next`（^1.16.1），稳定可靠
- **Vue 3 组合式 API + TypeScript**：完整类型定义，IDE 智能提示，`vue-tsc` 编译期类型检查
- **三级分类管理**：基础组件（4 个子分组）/ 媒体与工具 / 业务组件，侧边栏自动扫描登记
- **完整质量链**：每个组件配套 `*.spec.ts` 单测、API 文档、浏览器实测，`build:lib` / `build:docs` 双构建验证
- **复制即用**：组件代码可直接复制到业务项目，或通过 `@cb-ui/components` workspace 包引入

---

## 二、技术栈

| 技术        | 版本                 | 说明                                      |
| ----------- | -------------------- | ----------------------------------------- |
| Vue         | ^3.4.0               | 组件实现框架                              |
| TDesign     | ^1.16.1              | 底层 UI 组件库（tdesign-vue-next）        |
| TypeScript  | ^5.4.0               | 类型系统                                  |
| Vite        | ^8.0.0               | 构建工具（VitePress 内置）                |
| VitePress   | ^1.2.0（实装 1.6.4） | 文档站点生成器                            |
| TailwindCSS | ^3.4.0               | 原子样式                                  |
| Sass        | ^1.101.3             | 复杂样式与主题变量（modern-compiler API） |
| pnpm        | ^9.0.0               | Monorepo 包管理                           |
| Vitest      | ^3.0.0               | 单元测试                                  |

---

## 三、与 TDesign 的关系

```
┌─────────────────────────────────────────────────────────────┐
│                      业务项目                                │
│  复制 CB UI 组件源码 → 按业务需求调整                         │
└─────────────────────────────────────────────────────────────┘
                              ↑ 复制 / workspace 引入
┌─────────────────────────────────────────────────────────────┐
│                       CB UI                                  │
│  业务源码沉淀 + 最小必要修正：                                │
│  - 统一 Cb 前缀命名                                          │
│  - 统一文档 / 单测 / 分类管理                                 │
│  - 完整类型定义与验证链                                      │
└─────────────────────────────────────────────────────────────┘
                              ↑ 依赖（peerDependencies）
┌─────────────────────────────────────────────────────────────┐
│                     TDesign                                  │
│  腾讯开源企业级设计系统，提供 60+ 基础组件                    │
└─────────────────────────────────────────────────────────────┘
```

---

## 四、组件分类体系

组件按**依赖强度**分为三类（对应侧边栏三个分组，配置在 `docs/.vitepress/config.ts`）：

| 分类           | 判定标准                                                   | 数量 | 示例                                            |
| -------------- | ---------------------------------------------------------- | ---- | ----------------------------------------------- |
| **基础组件**   | 通用 UI 原子/布局/反馈，无业务依赖，再按功能分 4 个子分组  | 25   | Button、CurrencyInput、StatusTag、GridLayout    |
| **媒体与工具** | 面向特定内容类型或提供独立工具能力，不依赖业务服务         | 6    | CbAudioPlayer、CbVideoPlayer、ImageSecret、Copy |
| **业务组件**   | 依赖具体业务场景或数据服务（临时 URL、上传、转写、权限等） | 13   | CbPublicTable、CbUpload、CbPermissionTree       |

> 基础组件内部细分为：**按钮与操作**（3）/ **输入与选择**（10）/ **数据展示**（5）/ **布局与容器**（7）。

## 五、组件落地流程（组件从何而来）

```
业务项目组件源码
      │  原样粘贴进 packages/components/src/<name>/
      ▼
最小必要修正（类型导入源 / defineModel 泛型 / 组件名冲突 / TSX→h() 等）
      ▼
配套交付：index.ts（barrel） + <Name>.spec.ts（单测） + docs/components/<name>.md（文档）
      ▼
侧边栏登记（基础/媒体/业务三集合） + pnpm gen:index（全量入口）
      ▼
验证链：vue-tsc → eslint → vitest → build:lib → build:docs → 浏览器实测
```

---

## 六、项目结构

```
cb-ui/
├── packages/
│   ├── components/          # 组件库源码（核心）
│   │   └── src/
│   │       ├── button/      # 单个组件目录（kebab-case）
│   │       │   ├── Button.vue
│   │       │   ├── types.ts / interface.ts
│   │       │   ├── index.ts # 组件目录入口（barrel）
│   │       │   └── Button.spec.ts
│   │       ├── index.ts     # 全量入口（自动生成，勿手改）
│   │       ├── resolver.ts  # 按需加载 Resolver（Cb 前缀）
│   │       ├── config/      # serviceManager shim 等
│   │       └── directives/  # 自定义指令（v-click-outside）
│   ├── theme/               # 主题变量（variables.scss / tailwind.preset.js）
│   └── utils/               # 工具函数
├── docs/
│   ├── .vitepress/          # VitePress 配置（侧边栏分类、Sass、别名）
│   ├── components/          # 组件文档（44 篇，自动扫描进侧边栏）
│   ├── guide/               # 指南（本文档）
│   └── prd/                 # 产品与方案文档
├── scripts/
│   ├── generate-index.mjs   # 全量入口生成器（pnpm gen:index）
│   └── gen-component.mjs    # 组件脚手架（pnpm gen <name> [中文名]）
└── package.json             # 根 workspace 配置
```

---

## 七、当前规模

- 组件总数：**44 个**（含 1 个指令 `v-click-outside`，随全量入口自动注册）
- 单元测试：**240 条**（44 个 spec 文件，全量回归通过）
- 文档站点：`pnpm dev` 启动后访问 `http://localhost:5173`

---

## 八、快速开始

```bash
# 本地启动文档站
pnpm install
pnpm dev        # → http://localhost:5173

# 在业务项目中使用
# 1. 安装底层依赖：pnpm add tdesign-vue-next
# 2. 从文档站复制需要的组件目录到项目（或引入 workspace 包）
```

详见 [快速上手](/guide/quickstart)。
