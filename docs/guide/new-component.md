---
title: 新组件开发文档
description: 从零往 CB UI 添加一个组件的完整实操指南，照着做即可，无需问作者。
---

# 新组件开发文档

本文档是**从零添加一个组件**的完整实操指南。目标读者是任何要往 CB UI 加组件的开发者——不熟悉本库也没关系，按章节顺序照做即可。

> 与《组件开发指南》的分工：本文档讲"**怎么做**"（步骤、模板、命令）；《组件开发指南》讲"**规范与铁律**"（落地原则、修正案例、验证细节）。两个一起看效果最佳。

---

## 一、先理解：一个组件由什么组成

添加一个组件 = 在 **6 个位置**放东西：

```
packages/components/src/<kebab-case>/   ← ① 组件目录（本体）
├── <PascalCase>.vue     组件实现
├── types.ts             Props / Emits / Slots 类型定义
├── index.ts             目录出口（barrel，供脚本扫描）
├── <PascalCase>.spec.ts 单元测试
└── style.scss           组件样式（可选）

docs/components/<kebab-case>.md          ← ② 组件文档
docs/.vitepress/config.ts                ← ③ 侧边栏分类登记
packages/components/src/index.ts         ← ④ 全量入口（脚本自动生成，勿手改）
```

**只做 ①②③**，第 ④ 步用一条命令自动完成。下面逐一展开。

---

## 二、第一步：选添加方式（三条路）

### 路线 A：脚手架生成（推荐全新组件）

```bash
pnpm gen modal 模态框
# 格式：pnpm gen <组件英文名(kebab-case)> [中文名]
```

脚本自动完成：

| 自动生成 | 路径 |
| --- | --- |
| 组件目录 + 4 个文件 | `packages/components/src/modal/`（Modal.vue / types.ts / index.ts / style.scss） |
| 文档模板 | `docs/components/modal.md` |
| 全量入口更新 | 自动执行 `pnpm gen:index` 重写 `src/index.ts` |

**生成后你还必须做 3 件事**（脚手架不代劳）：

1. **写组件逻辑**：填 Modal.vue 的 template / script / style
2. **写单测**：补 `Modal.spec.ts`（见 3.4）
3. **侧边栏登记**：若组件属于媒体/业务/基础子分组，改 `config.ts`（见第四章）

### 路线 B：沉淀业务源码（本库组件的主要来源）

业务项目里的组件原样落库的标准流程：

```
1. 原样粘贴源码 → packages/components/src/<name>/
2. 最小必要修正（构建/类型/功能所需，逐条记录在交付说明）
3. 补 index.ts（barrel，供 gen:index 扫描）
4. 写 <Name>.spec.ts 单测
5. 写 docs/components/<name>.md 文档
6. config.ts 三集合登记 + pnpm gen:index
7. 验证链全绿 + 浏览器实测
8. 交付：改动说明 + 验证清单 + 组件数
```

::: tip 铁律
业务源码**原样粘贴、一字不改**；只做必要的最小修正，且每次修正都需在交付说明中逐条告知。常见修正类型（类型导入源替换、defineModel 泛型、TSX→h() 等）见《组件开发指南》第二节的案例表。
:::

### 路线 C：复制现有组件改造

```bash
# 以 button 为模板复制一份
xcopy /e /i packages\components\src\button packages\components\src\modal
# 逐个改名：Modal.vue / types.ts / index.ts / style.scss 内容
# 最后重生成入口
pnpm gen:index
```

适合"和已有组件结构很像"的场景。记得同步改 `defineOptions({ name: 'CbXxx' })`、目录名、类名前缀。

---

## 三、逐文件编写（模板可直接复制）

以新增 `Modal 模态框`（目录 `modal`，组件名 `CbModal`）为例。

### 3.1 `Modal.vue` — 组件本体

```vue
<template>
  <div class="cb-modal">
    <slot />
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'CbModal' })

import type { ModalProps, ModalEmits, ModalSlots } from './types'

const props = withDefaults(defineProps<ModalProps>(), {})
const emit = defineEmits<ModalEmits>()
</script>

<style scoped lang="scss">
@use "@cb-ui/theme/src/variables" as *;

.cb-modal {
  // 组件样式
}
</style>
```

**必须遵守的命名规则**：

| 项 | 规则 | 反例 |
| --- | --- | --- |
| 目录名 | kebab-case | `Modal` ✗ |
| 组件文件名 | PascalCase | `modal.vue` ✗ |
| `defineOptions` name | `Cb` + PascalCase | `Modal` ✗ |
| CSS 类 | `cb-` + kebab-case | `modal-box` ✗ |

**写逻辑时的高频依赖**（直接用即可，无需 import）：

- TDesign 组件：模板里直接 `<t-button>`、`<t-dialog>` 等（TDesign 已全局注册）
- 图标：`<cb-icon name="xxx" />`（iconfont symbol 已注入）
- 主题变量：scss 里 `var(--td-brand-color)` 等直接可用（`additionalData` 已自动注入 Sass 变量）
- 业务服务：`import { serviceManager } from '#/config/api'`（`#` 别名指向组件库 src，dev 与构建都已配置）

> 若组件需要 JSX/TSX 写法（如 `render: () => <cb-icon />`），用 `<script setup lang="tsx">`，本项目 esbuild 已配置 `jsxImportSource: 'vue'`。

### 3.2 `types.ts` — 类型定义

```typescript
/** Modal 组件属性 */
export interface ModalProps {
  /**
   * 弹窗标题
   * @default ''
   */
  title?: string
  /**
   * 是否可见
   * @default false
   */
  visible?: boolean
}

/** Modal 组件事件 */
export interface ModalEmits {
  /**
   * 确认时触发
   */
  confirm: []
  /** 取消时触发（可带参数：事件对象） */
  cancel: [event: MouseEvent]
}

/** Modal 组件插槽 */
export interface ModalSlots {
  default: () => any
}
```

要点：

- Props / Emits / Slots 三个接口各写一份，**JSDoc 注释**会进入文档（`extract:props` 可自动提取）
- 可选属性全部 `?`，带默认值的在 JSDoc 写 `@default`
- 事件参数用元组类型 `[event: MouseEvent]`

### 3.3 `index.ts` — 目录出口（barrel）

```typescript
import Modal from './Modal.vue'
import type { ModalProps, ModalEmits, ModalSlots } from './types'

export { Modal }
export type { ModalProps, ModalEmits, ModalSlots }
export default Modal
```

**为什么必须长这样**：`pnpm gen:index` 用正则扫描每个目录的 `index.ts`：

- `export\s*\{\s*(\w+)\s*\}` → 提取组件名 `Modal`
- `export\s+type\s*\{([^}]+)\}` → 提取类型名 `ModalProps, ModalEmits, ModalSlots`

::: warning 注意
`export { }` 里**只放一个组件名**（正则只识别第一个）。若目录需要导出多个子组件，额外导出放在 `export default` 之后或另起行，并在交付说明里注明入口脚本的识别范围。
:::

### 3.4 `Modal.spec.ts` — 单元测试

每个组件**必须**配套 spec。基础模板：

```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import Modal from './Modal.vue'

const mountModal = (props = {}, slots = {}) =>
  mount(Modal, {
    props,
    slots,
    global: {
      plugins: [TDesign],
      stubs: {
        // 库内子组件按需 stub；TDesign 组件优先用真组件（global.plugins 引入）
        'cb-icon': { template: '<span class="stub-icon" />' },
      },
    },
  })

describe('CbModal', () => {
  it('渲染基础内容', () => {
    const wrapper = mountModal({ title: '标题' }, { default: '<div>内容</div>' })
    expect(wrapper.text()).toContain('标题')
  })
})
```

**必测 4 类**（对齐库内既有 spec 的覆盖标准）：

1. **渲染**：默认/必填 props 下 DOM 出现
2. **事件 emit**：触发交互后 `wrapper.emitted('xxx')` 有值且参数正确
3. **props 联动**：改 props（`setProps` / `setValue`）后行为变化
4. **条件分支**：v-if / disabled / 空态等边界

**踩过的坑（写单测前必读）**：

- stub 模板里**不能写 TS 断言**（`as HTMLInputElement` 会编译报错），直接 `$event.target.value`
- 依赖 TDesign 的组件：`global.plugins: [TDesign]`；弹层类组件（t-popup 等）stub 时**记得渲染 `<slot />` 默认插槽**，否则触发器不渲染
- happy-dom 环境差异：`navigator.clipboard` 原型自带需 `Object.defineProperty` 覆盖；`xlink:href` 读不到改用 `wrapper.html()` 断言
- 异步初始化的组件（onMounted / nextTick / MutationObserver）：断言前 `await new Promise(r => setTimeout(r, 50))`
- 测试文件本身也会被 lint，注意 unused import

运行：`npx vitest run packages/components/src/modal`，全量 `pnpm test`。

### 3.5 `style.scss`（可选）

```scss
@use "@cb-ui/theme/src/variables" as *;

.cb-modal {
  // 组件样式
}
```

纯 UI 组件建议独立样式文件；无样式需求的组件可不建。

### 3.6 `docs/components/modal.md` — 组件文档

> 下面的"文档模板"代码块使用 4 反引号围栏包裹，因为模板内部含 ```vue 子代码块——**外层必须用 4 个反引号**，否则内层 ``` 会提前终止外层块（历史踩坑点，见文末坑 1）。

````markdown
---
title: Modal 模态框
description: 模态框组件描述。
---

# Modal 模态框

一句话说明用途。

## 基础用法

通过 `visible` 控制显示，点击遮罩关闭。

<DemoBlock>
  <CbModal visible>内容</CbModal>

  <template #code>

```vue
<template>
  <CbModal visible>内容</CbModal>
</template>
```

  </template>
</DemoBlock>

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |

### Slots

| 插槽名 | 说明 |
| --- | --- |
| default | 默认内容 |
````

**文档编写的 5 个坑**：

1. **禁止嵌套代码块标记**：`DemoBlock` 的 `#code` 插槽里展示 vue 代码时用独立 fenced block，**不要在一个代码块内部再写另一个 ``` 标记**——内层标记会提前终止外层块，`</template>` 会被 Vue 编译器当真实标签解析，报 "Element is missing end tag"（历史踩坑）。上面模板就是标准写法，照抄即可
2. `<script setup>` 带 TS 类型必须写 `lang="ts"`
3. 演示用**真实数据**，不编造占位
4. 依赖父容器高度的组件（如表格类），演示容器需显式给高度
5. API 表格可先用 `pnpm extract:props` 生成草稿（输出到 `docs/.vitepress/generated/<目录>-api.md`），再复制进文档；也可用 `<!-- @include: ./.vitepress/generated/modal-api.md -->` 自动引入

---

## 四、更新入口 + 侧边栏登记

### 4.1 更新全量入口

```bash
pnpm gen:index
```

自动扫描所有组件目录，重写 `packages/components/src/index.ts`（import/export 组件与类型、指令、install 注册）。运行后检查输出是否包含你的组件名。

### 4.2 侧边栏分类登记（`docs/.vitepress/config.ts`）

组件文档放进 `docs/components/` 后，侧边栏**自动扫描**出现该组件；但**归入哪个分类**由三集合决定：

| 集合 | 判定标准 | 现有例子 |
| --- | --- | --- |
| `BASE_SUBGROUPS` | 通用 UI 原子/布局/反馈，无业务依赖 → 再分 4 子组 | button / input / status-tag / grid-layout |
| `MEDIA_TOOL_COMPONENTS` | 有独立能力、不依赖业务服务的中间层 | audio-player / video-player / copy / count-up-number |
| `BUSINESS_COMPONENTS` | 依赖业务场景或数据服务 | upload / public-table / permission-tree / dynamic-form-generator |

**不改 config.ts 的默认行为**：不属于任何集合的组件自动进"基础组件"（但不进子分组）。

改法（`MEDIA_TOOL_COMPONENTS` 示例，业务/基础同理）：

```typescript
const MEDIA_TOOL_COMPONENTS = new Set([
  // ...既有项
  'modal', // CbModal 模态框（xxx）
])
```

基础组件还要同时进子分组 `BASE_SUBGROUPS` 对应分组的 `keys` 数组。

::: tip
改完 `config.ts` 后 **dev server 需重启**侧边栏才刷新（`.vitepress/config.ts` 变更不会热更新）。
:::

---

## 五、验证链（交付前必跑）

| 步骤 | 命令 | 通过标准 |
| --- | --- | --- |
| 1. 类型检查 | `npx vue-tsc --noEmit -p packages/components/tsconfig.json` | 0 error |
| 2. 代码规范 | `npx eslint packages/components/src/<name>` | 0 errors（any 基线 warning 可接受） |
| 3. 组件单测 | `npx vitest run packages/components/src/<name>` | 全过 |
| 4. 全量回归 | `pnpm test` | 44 files / 240 tests 全绿 |
| 5. 组件库构建 | `pnpm build:lib` | dist 产物生成 |
| 6. 文档站构建 | 先停 dev → `pnpm build:docs` | 构建通过 |
| 7. 浏览器实测 | `pnpm dev` → 访问 `/components/<name>.html` | 渲染 + 交互正常 |

**三个必知坑位**：

- `build:docs` 与 dev 共用 `docs/.vitepress/.temp`，**构建前必须停 dev**：`netstat -ano | findstr :5173` 找 PID → `taskkill /PID <id> /F`
- Sass 已配置 `api: 'modern-compiler'` 消除 legacy-js-api 警告，**不要回退**
- Windows 下长命令用 `cmd /c "..."` 包裹（PowerShell 对 `&&`/管道不友好）

---

## 六、完成检查清单

- [ ] 目录名 kebab-case、组件名 `Cb<PascalCase>`、类名 `cb-xxx`
- [ ] 5 个文件齐全：`Xxx.vue` / `types.ts` / `index.ts` / `Xxx.spec.ts` / `style.scss`（可选）
- [ ] `index.ts` 按 barrel 规范（单个 `export { Xxx }` + 类型导出）
- [ ] 业务源码落地符合"一字不改 + 最小必要修正逐条记录"铁律
- [ ] 单测覆盖：渲染 / emit / props 联动 / 条件分支，且全过
- [ ] 文档：基础用法（DemoBlock + 真实数据）+ API 表，script 带 `lang="ts"`
- [ ] `pnpm gen:index` 跑过，全量入口含新组件
- [ ] `config.ts` 三集合登记正确（基础组件含子分组）
- [ ] 验证链 7 步全绿
- [ ] 交付说明：改动说明 + 验证清单 + 组件总数

---

## 七、速查：常见问题

| 问题 | 答案 |
| --- | --- |
| 组件文档侧边栏没出现？ | 确认 md 在 `docs/components/`；改过 config.ts 需重启 dev |
| 全量入口没我组件？ | 确认目录有 `index.ts` 且格式正确，重跑 `pnpm gen:index` |
| 单测报 "Cannot call xxx on empty DOMWrapper"？ | stub 的弹层组件没渲染默认插槽（补 `<slot />`）或异步未等待 |
| eslint 报 require 报错？ | `scripts/*.cjs` 是故意用 CommonJS，规则已在 `.eslintrc.cjs` overrides 关闭 |
| 组件要调业务接口？ | `import { serviceManager } from '#/config/api'`，测试用 `config/api.ts` shim |
| 引入后组件名冲突？ | `defineOptions name` 必须是全局唯一的 `CbXxx` |

更多细节见《组件开发指南》与《常见问题》。
