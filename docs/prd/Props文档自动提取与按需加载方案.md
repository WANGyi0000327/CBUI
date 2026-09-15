# CB UI 组件库 - Props 文档自动提取与按需加载方案

| 文档名称 | Props 文档自动提取与按需加载方案 |
| -------- | -------------------------------- |
| 版本     | V2.0.0（现状版）                 |
| 创建日期 | 2026-07-21                       |
| 更新日期 | 2026-09-14                       |
| 文档状态 | 已实施                           |

> **阅读提示**：本方案分两大部分——**Props 文档提取**（已落地）与**按需加载**（当前以"复制源码"模式供给业务项目，unplugin 自动引入为面向复制后项目的参考配置，未在组件库内启用）。文中明确标注「现状」「参考」。

---

## 一、Props 文档自动提取方案

### 1.1 需求背景

手动编写组件 API 文档效率低下且容易与代码不同步。通过 TypeScript 类型定义和 JSDoc 注释自动生成文档，可以确保：

- 文档与代码同步更新
- 减少重复工作
- 类型定义即文档，保证准确性

### 1.2 技术方案（现状）

#### 1.2.1 整体架构

```
┌─────────────────────────────────────────────────────────────┐
│                  Props 文档提取流程（现状）                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   组件源码                                                    │
│   ├── Xxx.vue                                               │
│   └── types.ts（Props/Emits/Slots 三接口 + JSDoc 注释）       │
│            │                                                 │
│            ▼                                                 │
│   extract-props.mjs ──▶ docs/.vitepress/generated/           │
│   （pnpm extract:props）     <组件目录>-api.md（API 草稿）     │
│            │                                                 │
│            ▼                                                 │
│   开发者复制草稿 → 组件文档 API 表格（docs/components/*.md）   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**结论先行**：当前采用 **types.ts JSDoc → 脚本生成草稿 → 人工确认后进文档** 的半自动方式。组件文档中的 API 表格**手工维护为主**，脚本负责生成草稿、减少重复劳动。

#### 1.2.2 类型定义规范（现状要求）

**类型文件**（`packages/components/src/<组件>/types.ts`）：

```typescript
/** 按钮尺寸 */
export type ButtonSize = 'small' | 'medium' | 'large'

/**
 * 按钮组件属性
 */
export interface ButtonProps {
  /**
   * 按钮尺寸
   * @default 'medium'
   */
  size?: ButtonSize
  /**
   * 是否禁用
   * @default false
   */
  disabled?: boolean
}

/**
 * 按钮组件事件
 */
export interface ButtonEmits {
  /** 点击时触发 */
  click: [event: MouseEvent]
}

/**
 * 按钮组件插槽
 */
export interface ButtonSlots {
  default: () => any
}
```

**JSDoc 注释规范**：

| 标签     | 用途     | 示例                                   |
| -------- | -------- | -------------------------------------- |
| `@default` | 默认值 | `@default 'medium'`                    |
| `@param` | 参数说明 | `@param event 鼠标事件对象`            |
| `@deprecated` | 废弃标记 | `@deprecated 请使用 size 属性`         |

**硬性要求**（影响提取与文档质量）：

1. 三接口命名必须以 `Props` / `Emits` / `Slots` 结尾
2. 可选属性写 `?`，带默认值的必须标 `@default`
3. 类型必须从 `index.ts` 中 `export type` 导出（入口脚本按此收集类型）

#### 1.2.3 提取脚本（现状）

| 项         | 说明                                                        |
| ---------- | ----------------------------------------------------------- |
| 脚本路径   | `packages/components/scripts/extract-props.mjs`             |
| 运行命令   | `pnpm extract:props`                                        |
| 输出目录   | `docs/.vitepress/generated/<组件目录>-api.md`（已在 .gitignore） |
| 使用方式   | 复制草稿到组件文档 API 表格，人工校对后提交                  |

**验证**：

```bash
pnpm extract:props && ls -la docs/.vitepress/generated/
```

> **历史尝试（记录，勿重复踩坑）**：VitePress 内置 `<!-- @include: ./.vitepress/generated/<组件>-api.md -->` 包含语法在本项目环境下未能正常渲染为 Markdown 表格（内容被当作代码块或直接消失），故当前不依赖该机制。若后续需要，可在 DemoBlock 组件层重新验证。

---

## 二、组件按需加载方案

### 2.1 需求背景

组件库面向业务项目的供给方式决定了加载策略：

| 供给模式         | 说明                                               | 加载策略 |
| ---------------- | -------------------------------------------------- | -------- |
| **复制源码**（现状） | 业务项目把组件目录源码拷入项目，随项目打包       | 天然按需：用哪个拷哪个 |
| **包引用**（预留）   | 通过 npm 包 / workspace 引用组件库                 | 全量 or unplugin 自动引入 |

> **现状**：组件库**不发布 npm 包**，业务项目采用复制源码方式——组件只进用它的项目，打包体积天然受控，**无需额外的按需加载工程**。本章其余内容为包引用场景的参考方案。

### 2.2 组件库入口设计（现状）

**全量入口** `packages/components/src/index.ts` —— **由脚本自动生成**，勿手改：

```bash
pnpm gen:index
# 自动扫描 packages/components/src/<组件>/index.ts
# 重写：import / export / export type / install 注册数组
```

**单组件出口** `packages/components/src/<组件>/index.ts`（barrel 规范）：

```typescript
import Modal from './Modal.vue'
import type { ModalProps, ModalEmits, ModalSlots } from './types'

export { Modal }
export type { ModalProps, ModalEmits, ModalSlots }
export default Modal
```

::: warning 入口脚本提取规则
`gen:index` 用正则 `export\s*\{\s*(\w+)\s*\}` 提取组件名（**只识别第一个**）、`export\s+type\s*\{([^}]+)\}` 提取类型。`export {}` 中只放一个组件名，多导出放 `export default` 之后。
:::

### 2.3 按需加载方案对比（参考）

| 方案                             | 优点             | 缺点             | 适用场景             |
| -------------------------------- | ---------------- | ---------------- | -------------------- |
| 复制源码（**现状**）             | 体积天然可控     | 组件更新靠手动同步 | 内部项目             |
| 手动按需引入                     | 灵活可控         | 代码冗长         | 小项目               |
| unplugin-vue-components 自动引入 | 零配置，自动检测 | 仅模板中使用     | 中大型项目           |
| Tree Shaking                     | 无需额外配置     | 依赖构建工具     | 全量引用的补充       |

### 2.4 自动引入参考配置（面向包引用场景）

组件包已内置 `CBUIResolver`（`packages/components/src/resolver.ts`，同时由 `exports["./resolver"]` 导出），业务项目按需接入：

```ts
// 业务项目 vite.config.ts
import { defineConfig } from 'vite'
import Components from 'unplugin-vue-components/vite'
import { CBUIResolver } from '@cb-ui/components/resolver'

export default defineConfig({
  plugins: [
    Components({
      resolvers: [CBUIResolver({ importStyle: true, prefix: 'Cb' })],
      dts: true,
    }),
  ],
})
```

**Resolver 行为**：模板中出现 `<CbButton>` 时自动生成

```typescript
import { Button } from '@cb-ui/components/button'
import '@cb-ui/components/button/style.scss'
```

**组件包侧已就位的基础设施**：

- `package.json`：`"type": "module"`、`"sideEffects": ["*.css", "*.scss"]`（Tree Shaking 友好）
- 单组件导出路径：`exports["./button"]` → `src/button/index.ts`
- 样式：组件 SFC 内部 `@use "@cb-ui/theme/src/variables"`（无独立 style.scss 的组件自动内联）

### 2.5 文档站接入方式（现状：全量注册）

文档站不需要按需加载——`docs/.vitepress/theme/index.ts` **全量注册**，示例才可随意使用任意组件：

```typescript
import { CBUI } from '@cb-ui/components'
import TDesign from 'tdesign-vue-next'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.use(TDesign) // t-* 标签
    app.use(CBUI)    // Cb* 组件（全量）
    app.component('DemoBlock', DemoBlock)
  },
}
```

> 文档站别名（`config.ts`）直接引用组件**源码**：`@cb-ui/components → packages/components/src`、`# → src`（业务 API 用 `config/api.ts` shim mock）、`canvas → stub`。

---

## 三、集成与验证（现状命令）

```bash
# 1. 类型检查（必带 --noEmit，防 TS5055）
npx vue-tsc --noEmit -p packages/components/tsconfig.json

# 2. 全量单测（44 files / 240 tests）
pnpm test

# 3. 组件库构建（Vite 8.1 + vite-plugin-dts）
pnpm build:lib

# 4. 生成 API 草稿
pnpm extract:props

# 5. 文档站构建（先停 dev）
pnpm build:docs
```

---

## 四、注意事项

### 4.1 Props 文档提取

1. **JSDoc 必须完整**：缺注释 → 文档缺说明；`@default` 缺失 → 默认值列空
2. **类型必须导出**：`index.ts` 未 `export type` 的类型无法被入口收集
3. **接口命名规范**：`XxxProps` / `XxxEmits` / `XxxSlots`
4. **API 表格手工校对**：脚本草稿生成后需人工检查类型展示、默认值是否与 `withDefaults` 一致

### 4.2 按需加载

1. **现状优先复制源码**：内部项目默认复制，无需引入 unplugin
2. **Resolver 预留**：包引用场景用 `@cb-ui/components/resolver`，prefix 与组件命名一致
3. **Tree Shaking**：组件包已配 `type: module` + `sideEffects` 标记
4. **文档站勿用按需**：全量注册保证示例可用性，体积非文档站关注点

---

## 五、总结

| 功能               | 方案（现状）                              | 工具                                 |
| ------------------ | ----------------------------------------- | ------------------------------------ |
| Props 文档提取     | types.ts JSDoc → 脚本生成草稿 → 人工确认  | extract-props.mjs                    |
| 全量入口维护       | 目录扫描自动重写                          | generate-index.mjs（pnpm gen:index） |
| 组件供给           | 复制源码（天然按需）                      | 无额外依赖                           |
| 自动引入（预留）   | unplugin + CBUIResolver                   | resolver.ts 已内置导出               |
| Tree Shaking       | ES Module + sideEffects 标记              | 组件包 package.json 已配置           |

> 一句话总结：**文档提取走"JSDoc → 草稿 → 人工"半自动链路；加载策略以复制源码为主，自动引入为包引用场景预留**。
