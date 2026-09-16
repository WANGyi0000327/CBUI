# CB UI

基于 **Vue 3 + TypeScript + TDesign** 二次开发的企业级前端组件库，配套 VitePress 文档站。通过 pnpm workspace 管理组件库本体、主题、工具函数与文档站，提供组件脚手架、单测覆盖与一键质量验证链。

## ✨ 特性

- **44 个开箱即用的组件**：基于 TDesign 二次开发，覆盖按钮、表格、上传、媒体播放、权限树等场景，分为基础组件 / 媒体与工具 / 业务组件三类
- **Monorepo 工程化**：`components`（组件库）、`theme`（设计 token）、`utils`（工具函数）、`docs`（文档站）四包统一管理
- **自动化脚手架**：`pnpm gen` 一条命令生成新组件（目录 5 文件 + 文档 + 入口），`pnpm gen:index` 自动维护全量入口
- **Props 文档自动提取**：从组件 `types.ts` 的 JSDoc 自动生成 API 文档片段，文档站 `@include` 引用，改注释即改文档
- **按需加载预留**：内置 `CBUIResolver`，可配合 `unplugin-vue-components` 实现按需自动引入
- **质量闭环**：`pnpm check` 一键验证（类型 + Lint + 单测 + 构建），当前 47 files / 262 tests 全绿，行覆盖率 77.77%
- **全量 / 按需双模式**：支持 `app.use(CBUI)` 全量注册，也支持 `@cb-ui/components/button` 子路径源码引用

## 🛠 技术栈

| 领域 | 技术 |
| --- | --- |
| 框架 | Vue 3.5、TypeScript 5.9 |
| 基础组件 | TDesign Vue Next 1.20 |
| 构建 | Vite 8（组件库，ES/CJS/UMD + d.ts）、VitePress 1.6（文档站） |
| 样式 | Sass 1.101 + TailwindCSS 3.4 + 主题 token |
| 测试 | Vitest 3.2 + happy-dom + @vitest/coverage-v8 |
| 工程 | pnpm 9 workspace、ESLint 8、Prettier 3 |

## 🚀 快速开始

**环境要求**：Node.js ≥ 18、pnpm ≥ 9

```bash
# 安装依赖
pnpm install

# 启动文档站开发服务器（默认 http://localhost:5173）
pnpm dev

# 构建组件库 + 文档站
pnpm build

# 一键质量验证：类型 + Lint + 单测 + 构建
pnpm check

# 单测覆盖率报告
pnpm test:coverage
```

> 组件库文档已接入 `#/config/api` 的 `serviceManager` shim（`getFileTempUrl` 直接回传路径），组件库与文档站无需真实业务服务即可编译运行；业务方接入时在自身项目提供真实实现覆盖即可。

## 📦 仓库结构

```
CBUi/
├── packages/
│   ├── components/        # ★ 组件库本体（44 个组件 + 构建/按需加载）
│   ├── theme/             # 设计 token：Sass 变量、Tailwind 预设
│   └── utils/             # 通用工具函数（uid / debounce / deepClone 等）
├── docs/                  # ★ VitePress 文档站（指南 / 组件示例 / PRD）
├── scripts/               # 根级脚本（generate-index.mjs / gen-component.mjs）
├── pnpm-workspace.yaml    # workspace 定义
├── vitest.config.ts       # 单测配置
└── tailwind.config.ts     # Tailwind 扫描与预设
```

详细的逐文件说明（每个脚本干什么、每个指令什么时候用）见 **[项目结构文档](./docs/guide/project-structure.md)**。

## 🧩 组件库

组件目录规范：每个组件一个目录，包含 `Xxx.vue`（组件体）、`index.ts`（导出）、`types.ts`（Props/Events/Slots + JSDoc）、`style.scss`（样式）、`Xxx.spec.ts`（单测）。

**新增组件（推荐用脚手架）**：

```bash
pnpm gen <英文名> <中文名>
# 示例：pnpm gen date-picker 日期选择器
```

脚手架会自动生成上述 5 文件 + 文档页，并刷新全量入口。完整流程与验收清单见 **[新组件开发指南](./docs/guide/new-component.md)**。

**使用方式**：

```ts
// 全量引入
import CBUI from '@cb-ui/components'
import '@cb-ui/components/dist/style.css'
app.use(CBUI)

// 按需（配合 unplugin-vue-components）
import { CBUIResolver } from '@cb-ui/components/resolver'
Components({ resolvers: [CBUIResolver()] })

// 子路径引用（走源码）
import { Button } from '@cb-ui/components/button'
```

## 📚 文档站

文档站基于 VitePress，侧边栏自动扫描 `docs/components/*.md`，按三类自动归类（未登记的基础组件落入「未分组」兜底区）：

- **指南**：介绍 / 快速上手 / 新组件开发 / 组件开发指南 / 项目结构 / 常见问题
- **组件**：44 篇组件文档（含 API 表格，由 `pnpm extract:props` 自动生成）
- **PRD**：产品与技术方案 4 篇

## ✅ 质量保障

| 检查项 | 现状 |
| --- | --- |
| 单元测试 | **47 files / 262 tests 全绿**（Vitest + happy-dom） |
| 覆盖率基线 | 77.77% stmts / 81.57% branch / 77.77% lines |
| 类型检查 | `vue-tsc --noEmit` 0 error |
| Lint | **0 errors / 0 warnings**（`no-explicit-any` 147 条债务已全部清理） |
| 版本管理 | Changesets 配置就绪（`@cb-ui/components|theme|utils`，0.x 内部阶段尚未接入发布流水线） |
| 一键验证 | `pnpm check`（type → lint → test → build） |

## 🤝 参与贡献

1. `pnpm gen` 或手写组件目录（遵循上述目录规范与命名铁律）
2. 组件 `types.ts` 写全 JSDoc（Props/Events/Slots）
3. 补充 `Xxx.spec.ts` 单元测试（参考同目录既有 spec）
4. 提交前跑 `pnpm check` 全绿

## 📄 License

[MIT](./LICENSE) © 2026 CB UI
