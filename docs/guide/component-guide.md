---
title: 组件开发指南
---

# 组件开发指南

本文档说明如何向 CB UI 添加、修改、删除组件，以及落地规范与验证链。

::: tip 落地铁律
组件源码来自业务项目，**原样粘贴、一字不改**；只做构建/类型/功能所需的最小必要修正，且每次修正都需在交付说明中逐条告知。
:::

---

## 一、目录结构

```
packages/components/src/
├── <kebab-case>/
│   ├── <PascalCase>.vue     # 组件实现（defineOptions name: 'Cb<PascalCase>'）
│   ├── types.ts             # 类型定义（Props/Emits/Slots；部分组件用 interface.ts）
│   ├── index.ts             # 组件目录入口（barrel：导出组件 + 类型）
│   ├── <PascalCase>.spec.ts # 单元测试（Vitest + @vue/test-utils）
│   └── style.scss           # 组件样式（可选）
├── index.ts                 # 全量入口（脚本生成，勿手改）
├── resolver.ts              # 按需加载 Resolver（Cb 前缀）
├── config/api.ts            # serviceManager shim（业务服务 mock）
├── directives/              # 自定义指令（v-click-outside）
└── assets/                  # 图标资源（iconfont SVG Sprite 等）

docs/
├── components/<kebab-case>.md   # 组件文档（自动扫描进侧边栏）
└── .vitepress/config.ts         # 侧边栏分类登记（三集合）
```

---

## 二、快速添加组件

### 方式一：脚手架生成（适合全新组件）

```bash
pnpm gen modal 模态框
```

脚本（`scripts/gen-component.mjs`）自动完成：

1. 创建 `packages/components/src/modal/`（Modal.vue / types.ts / index.ts / style.scss）
2. 生成 `docs/components/modal.md` 文档模板
3. 自动运行 `pnpm gen:index` 更新全量入口
4. 侧边栏自动扫描，无需手动配置

生成后仍需：补充组件逻辑、编写单测、在侧边栏集合登记（见第四章）、走完整验证链。

### 方式二：沉淀业务源码（CB UI 的主要来源）

业务项目组件落地为本库组件的标准流程：

```
1. 原样粘贴源码 → packages/components/src/<name>/
2. 最小必要修正（逐条记录）
3. 补 index.ts（barrel，供 gen:index 扫描）
4. 写 <Name>.spec.ts 单测
5. 写 docs/components/<name>.md 文档
6. config.ts 三集合登记 + pnpm gen:index
7. 验证链全绿 + 浏览器实测
8. 交付：改动说明 + 验证清单 + 组件数
```

**常见最小修正类型**（历史案例）：

| 修正 | 场景 | 案例 |
| --- | --- | --- |
| 类型导入源替换 | 业务用 `@repo/tdesign-ui` 别名，本库无此包 | CbPublicTable → 改为 `tdesign-vue-next` |
| `defineModel` 泛型补齐 | vue-tsc 报无匹配重载 | `defineModel<number[]>(...)` |
| 组件名去重/兼容 | 副本组件与原组件同名 | checkTag.vue 内部 name `CbStatusTag` |
| TSX → `h()` 渲染 | eslint 的 vue parser 不解析 `.vue` 内 JSX | `sortIcon: () => h('cb-icon', {...})` |
| 补缺失类型定义 | 业务源码引用了未粘贴的定义 | interface.ts 补 `SearchItem` |
| 模板类型收窄 | prop 可 undefined 传给必填类型 | `:typeList="highSearchList \|\| []"` |

### 方式三：手动创建

复制已有组件目录作为模板，修改后运行 `pnpm gen:index`：

```bash
cp -r packages/components/src/button packages/components/src/modal
# 修改 Modal.vue / types.ts / index.ts 内容
pnpm gen:index   # 自动更新全量入口
```

---

## 三、组件源码规范

### 3.1 组件命名

| 类型 | 规则 | 示例 |
| --- | --- | --- |
| 目录名 | kebab-case | `public-table` |
| 组件文件名 | PascalCase | `PublicTable.vue` |
| 组件 name | 前缀 + PascalCase | `CbPublicTable` |
| 模板使用 | 前缀 + PascalCase | `<CbPublicTable>` |
| CSS 类 | `cb-` 前缀 + kebab | `.cb-public-table` |
| 类型接口 | PascalCase + Props/Emits | `PublicTableProps` |

### 3.2 SFC 骨架

```vue
<template>
  <div class="cb-xxx">
    <slot />
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'CbXxx' })
import type { XxxProps } from './types'
withDefaults(defineProps<XxxProps>(), {})
</script>

<style scoped lang="scss">
@use "@cb-ui/theme/src/variables" as *;

.cb-xxx {
  // 组件样式
}
</style>
```

### 3.3 index.ts（barrel）规范

```typescript
import Xxx from './Xxx.vue'
import type { XxxProps, XxxEmits, XxxSlots } from './types'

export { Xxx }
export type { XxxProps, XxxEmits, XxxSlots }
export default Xxx
```

> `pnpm gen:index` 会扫描每个组件目录的 `index.ts`，正则提取 `export { Name }` 与 `export type { ... }`，自动写入全量入口。**入口文件 `src/index.ts` 勿手改。**

---

## 四、侧边栏分类登记

侧边栏由 `docs/.vitepress/config.ts` 自动扫描 `docs/components/` 生成，但组件归属哪个分组由三个集合决定：

| 集合 | 判定标准 | 示例 |
| --- | --- | --- |
| `BASE_SUBGROUPS` | 基础组件，按功能再分 4 子组 | 按钮与操作 / 输入与选择 / 数据展示 / 布局与容器 |
| `MEDIA_TOOL_COMPONENTS` | 媒体与工具：有独立能力、不依赖业务 | audio-player / video-player / copy / count-up-number / image-secret / render-component |
| `BUSINESS_COMPONENTS` | 业务组件：依赖业务场景或数据服务 | upload / public-table / permission-tree / dynamic-form-generator 等 |

新增组件时在对应集合登记（或按分类标准新增集合），**新增/修改 md 后需重启 `pnpm dev`** 侧边栏才刷新。

---

## 五、文档编写规范

组件文档位于 `docs/components/<name>.md`，结构：

frontmatter 与章节骨架：

```markdown
---
title: Xxx 组件名
---

# Xxx 组件名

一句话说明用途。

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
```

演示示例（`DemoBlock` 渲染 + `#code` 展示源码）：

```markdown
<DemoBlock>
  <CbXxx />

  <template #code>
    <!-- 将下方 Vue 源码示例写入此处 -->
  </template>
</DemoBlock>
```

```vue
<template>
  <CbXxx />
</template>
```

> 注意：`DemoBlock` 与其 `#code` 插槽写在 markdown 正文；展示的 Vue 代码放进独立的 fenced code block。**不要在同一个代码块内部再嵌套另一个代码块标记**，否则内层标记会提前终止外层块，后续 `</template>` 等会被 Vue 编译器当作真实标签解析并报 "Element is missing end tag"。

**规范要点**：

- `<script setup>` 中带 TS 类型必须写 `lang="ts"`，否则 Vue 编译器报错
- 演示使用**真实数据**，不编造占位
- 依赖父容器高度的组件（如 CbPublicTable）演示容器需显式给高度
- markdown 中展示 Vue 代码时，`<template>` / `<script>` 等标签在部分场景需转义为 `&lt;template&gt;`，避免被当作真实组件解析
- API 表格可先用 `pnpm extract:props` 生成草稿（输出到 `docs/.vitepress/generated/`），再复制到文档手动维护

---

## 六、单测规范

每个组件配套 `&lt;Name&gt;.spec.ts`，覆盖：渲染、事件 emit、props 联动、条件分支（如分页显隐）。

```typescript
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Xxx from './Xxx.vue'
import TDesign from 'tdesign-vue-next'

describe('CbXxx', () => {
  it('渲染基础内容', () => {
    const wrapper = mount(Xxx, {
      global: { plugins: [TDesign], stubs: { 'cb-icon': true } },
    })
    expect(wrapper.text()).toContain('...')
  })
})
```

**已知测试坑**：

- TDesign 组件的运行时具名导出可能是 undefined → 用 `findAllComponents({ name: 'TCheckbox' })` 选择器
- 组件内部 `immediate` watch 会吞掉首轮 emit → `await nextTick()` 两次后再断言
- 依赖网络/上传服务的组件在测试中 stub 掉对应子组件

运行：`npx vitest run packages/components/src/<name>` 或全量 `pnpm test`。

---

## 七、验证链（交付前必跑）

| 步骤 | 命令 | 通过标准 |
| --- | --- | --- |
| 1. 类型检查 | `npx vue-tsc --noEmit -p packages/components/tsconfig.json` | 0 error |
| 2. 代码规范 | `pnpm lint` | 0 errors（any 基线 warning 可接受） |
| 3. 单元测试 | `npx vitest run packages/components/src/<name>` | 全过 |
| 4. 全量回归 | `pnpm test` | 28 files / 160 tests |
| 5. 组件库构建 | `pnpm build:lib` | dist 产物生成 |
| 6. 文档站构建 | 先停 dev → `pnpm build:docs` | 构建通过、legacy 警告 0 |
| 7. 浏览器实测 | `pnpm dev` → 访问 `/components/<name>.html` | 渲染 + 交互正常 |

**关键坑位**：

- `build:docs` 与 `dev` 共用 `docs/.vitepress/.temp`，**构建前必须停 dev**（`netstat -ano | findstr :5173` 找 PID → `taskkill /PID <id> /F`）
- Sass 已配置 `api: 'modern-compiler'` 消除 legacy-js-api 弃用警告，**不要回退**
- Windows PowerShell 对 `&&` / 管道不友好，长命令用 `cmd /c "..."` 包裹

---

## 八、修改 / 删除组件

**修改**：改源码后 dev 热更新即时生效；改文档/登记后需重启 dev；改 `src/index.ts` 或 `resolver.ts` 后重启 dev。

**删除**：

```bash
# 1. 删除组件目录
rm -rf packages/components/src/modal

# 2. 删除文档
rm docs/components/modal.md

# 3. 侧边栏集合移除登记项（如已登记）

# 4. 重生成全量入口
pnpm gen:index
```

---

## 九、检查清单

新增/沉淀一个组件，逐项核对：

- [ ] 组件目录文件齐全：`Xxx.vue` / `types.ts` / `index.ts` / `Xxx.spec.ts`（+ `style.scss`）
- [ ] `defineOptions({ name: 'CbXxx' })` 命名正确
- [ ] `index.ts` 按 barrel 规范导出组件与类型
- [ ] 源码按"一字不改"原则落地，修正项逐条记录
- [ ] 单测覆盖核心逻辑且全过
- [ ] 文档含基础用法 + API（Props/Events/Slots），script 带 `lang="ts"`
- [ ] 侧边栏三集合登记 + `pnpm gen:index` 重跑
- [ ] 验证链 7 步全绿
- [ ] 交付说明：改动说明 + 验证清单 + 组件总数
