---
title: 组件开发指南
---

# CB UI 组件库维护指南

本文档详细说明如何添加、修改、删除组件，以及前缀配置方法。

---

## 一、目录结构

```
packages/components/src/
├── button/                 # 组件目录（kebab-case）
│   ├── Button.vue          # 组件实现
│   ├── types.ts            # 类型定义
│   └── index.ts            # 导出入口
├── input/
├── card/
├── modal/
├── index.ts                # 组件库总入口（自动生成，无需手动修改）
├── resolver.ts             # 前缀配置（修改前缀在这里）
└── style.ts                # 全局样式入口
```

---

## 二、快速添加组件（推荐方式）

### 2.1 一键生成（最推荐）

使用脚手架脚本，一行命令生成组件所有文件并自动注册：

```bash
pnpm gen modal 模态框
```

脚本会自动完成：
1. 创建 `packages/components/src/modal/` 目录及文件
2. 生成 `docs/components/modal.md` 文档模板
3. 自动更新 `packages/components/src/index.ts`
4. 侧边栏自动扫描，无需手动修改 `config.ts`

::: tip 说明
`pnpm gen` 是 `node scripts/gen-component.mjs` 的快捷命令，定义在根目录 `package.json` 中。
:::

### 2.2 复制已有组件（手动）

如果不想用脚本，可以复制已有组件目录手动修改：

```bash
# 复制 button 目录作为模板
cp -r packages/components/src/button packages/components/src/modal

# 然后修改里面的文件内容
```

**复制后需要修改的文件**：

1. `Modal.vue`：组件实现
2. `types.ts`：类型定义
3. `index.ts`：导出入口

**修改完成后，记得运行以下命令自动更新入口**：

```bash
pnpm gen:index
```

**Modal.vue 模板示例**：

```vue
&lt;template&gt;
  &lt;div class="cb-modal"&gt;
    &lt;slot /&gt;
  &lt;/div&gt;
&lt;/template&gt;

&lt;script setup lang="ts"&gt;
import type { ModalProps } from './types'

withDefaults(defineProps&lt;ModalProps&gt;(), {
  // 在这里设置默认值
})
&lt;/script&gt;

&lt;style scoped lang="scss"&gt;
.cb-modal {
  // 组件样式
}
&lt;/style&gt;
```

**生成的 types.ts**：

```typescript
export interface ModalProps {
  // 在这里定义 props
}
```

**生成的 index.ts**：

```typescript
import Modal from './Modal.vue'
import type { ModalProps } from './types'

export { Modal }
export type { ModalProps }
export default Modal
```

### 2.2 手动添加组件

如果脚手架脚本不可用，可以按以下步骤手动创建：

#### 步骤 1：创建目录

```
packages/components/src/
└── modal/
    ├── Modal.vue
    ├── types.ts
    └── index.ts
```

#### 步骤 2：写 Modal.vue

```vue
&lt;template&gt;
  &lt;div class="cb-modal"&gt;
    &lt;slot /&gt;
  &lt;/div&gt;
&lt;/template&gt;

&lt;script setup lang="ts"&gt;
import type { ModalProps } from './types'

withDefaults(defineProps&lt;ModalProps&gt;(), {})
&lt;/script&gt;

&lt;style scoped lang="scss"&gt;
.cb-modal {
  /* 样式 */
}
&lt;/style&gt;
```

#### 步骤 3：写 types.ts

```typescript
export interface ModalProps {
  title?: string
}
```

#### 步骤 4：写 index.ts

```typescript
import Modal from './Modal.vue'
import type { ModalProps } from './types'

export { Modal }
export type { ModalProps }
export default Modal
```

#### 步骤 5：在总入口注册

编辑 `packages/components/src/index.ts`，加 3 行：

```typescript
// 顶部导入区追加
import { Modal } from './modal'

// 导出组件区追加
export { Modal }

// 导出类型区追加
export type { ModalProps } from './modal'

// 组件列表追加
const components = [Button, Input, Card, Modal]
```

#### 步骤 6：写组件文档 `docs/components/modal.md`

这是最麻烦的一步。下面是模板，复制粘贴即可：

```markdown
---
title: Modal 模态框
description: 在浮层中显示内容。
---

# Modal 模态框

在浮层中显示内容。

## 基础用法

&lt;DemoBlock&gt;
  &lt;CbModal title="标题"&gt;内容&lt;/CbModal&gt;

  &lt;template #code&gt;

```vue
&lt;template&gt;
  &lt;CbModal title="标题"&gt;内容&lt;/CbModal&gt;
&lt;/template&gt;
```

  &lt;/template&gt;
&lt;/DemoBlock&gt;

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
```

#### 步骤 7：更新侧边栏

编辑 `docs/.vitepress/config.ts`，在 sidebar 数组中添加：

```typescript
{ text: 'Modal 模态框', link: '/components/modal' },
```

#### 步骤 8：预览

```bash
pnpm dev
# 访问 http://localhost:5173/components/modal
```

---

## 三、创建组件文档

复制已有组件的文档模板（如 `button.md`），修改内容：

```bash
# 复制 button.md 作为模板
cp docs/components/button.md docs/components/modal.md
# 然后修改里面的内容
```

**文档模板结构**：

```markdown
---
title: Modal 模态框
description: 在浮层中显示内容。
---

# Modal 模态框

在浮层中显示内容。

## 基础用法

&lt;DemoBlock&gt;
  &lt;CbModal title="标题"&gt;内容&lt;/CbModal&gt;

  &lt;template #code&gt;

```vue
&lt;template&gt;
  &lt;CbModal title="标题"&gt;内容&lt;/CbModal&gt;
&lt;/template&gt;
```

  &lt;/template&gt;
&lt;/DemoBlock&gt;

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
```

---

## 四、修改组件

修改组件文件后，VitePress 会自动热更新。

| 修改内容 | 位置 |
|---|---|
| 组件逻辑 | `Component.vue` 的 `<script>` 部分 |
| 组件样式 | `Component.vue` 的 `<style>` 部分 |
| 组件类型 | `types.ts` |
| 样式变量 | `packages/theme/src/variables.scss` |

---

## 五、删除组件

```bash
# 1. 删除组件目录
rm -rf packages/components/src/modal

# 2. 在 packages/components/src/index.ts 中删除相关 import / export
# 3. 删除文档
rm docs/components/modal.md
# 4. 在 docs/.vitepress/config.ts 侧边栏中删除对应项
```

---

## 六、配置组件前缀（Cb）

### 6.1 前缀在哪里配置

前缀配置在 `packages/components/src/resolver.ts` 中。

**完整源码**：

```typescript
/**
 * 组件解析器接口
 * 与 unplugin-vue-components 的 ComponentResolver 接口一致
 */
export interface ComponentResolver {
  type?: 'component' | 'directive'
  resolve: (name: string) => {
    name: string
    from: string
    sideEffects?: string
  } | undefined
}

/**
 * CB UI Resolver 选项
 */
export interface CBUIResolverOptions {
  /** 是否自动导入样式 @default true */
  importStyle?: boolean
  /** 组件名前缀 @default 'Cb' */
  prefix?: string
  /** 组件库名称 @default '@cb-ui/components' */
  libraryName?: string
  /** 样式文件后缀 @default 'scss' */
  styleSuffix?: 'scss' | 'css'
}

export function CBUIResolver(options: CBUIResolverOptions = {}): ComponentResolver {
  const {
    importStyle = true,
    prefix = 'Cb',                // ← 前缀默认值在这里
    libraryName = '@cb-ui/components',
    styleSuffix = 'scss',
  } = options

  return {
    type: 'component',
    resolve: (name: string) => {
      if (!name.startsWith(prefix)) return    // 检查是否以前缀开头
      const partialName = name.slice(prefix.length)  // 去掉前缀
      const kebabName = partialName.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
      const result: any = {
        name: partialName,
        from: `${libraryName}/${kebabName}`,
      }
      if (importStyle) {
        result.sideEffects = `${libraryName}/${kebabName}/style.${styleSuffix}`
      }
      return result
    },
  }
}
```

### 6.2 方式一：修改默认前缀（影响所有使用者）

编辑 `resolver.ts` 第 57 行：

```typescript
// 原来
const { prefix = 'Cb' } = options

// 改成 'My'
const { prefix = 'My' } = options
```

修改后，组件使用方式变为 `<MyButton>`、`<MyModal>`。

### 6.3 方式二：使用时动态配置（推荐，灵活）

在业务项目的 `vite.config.ts` 中配置：

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { CBUIResolver } from '@cb-ui/components/resolver'

export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [
        CBUIResolver({
          prefix: 'Cb',   // 文档站用 Cb 前缀
        })
      ],
    }),
  ],
})
```

### 6.4 方式三：业务项目自定义前缀

如果某个业务项目想用自己的前缀（如 `My`）：

```typescript
// 业务项目的 vite.config.ts
import { CBUIResolver } from '@cb-ui/components/resolver'

export default defineConfig({
  plugins: [
    Components({
      resolvers: [
        CBUIResolver({
          prefix: 'My',   // 业务项目用 My 前缀
        })
      ],
    }),
  ],
})
```

这样业务项目里就能这样使用：

```vue
&lt;template&gt;
  &lt;MyButton&gt;按钮&lt;/MyButton&gt;
  &lt;MyModal title="标题"&gt;内容&lt;/MyModal&gt;
&lt;/template&gt;
```

不需要修改组件库源代码，组件库本身仍然以 Cb 前缀发布。

### 6.5 前缀工作原理

```
用户在模板写：&lt;CbButton&gt;
                    ↓
Resolver 收到 'CbButton'
                    ↓
1. 'CbButton'.startsWith('Cb') ? → true
2. 去掉前缀 → 'Button'
3. 转为 kebab-case → 'button'
4. 返回：
   {
     name: 'Button',
     from: '@cb-ui/components/button',
     sideEffects: '@cb-ui/components/button/style.scss'
   }
                    ↓
自动生成 import 语句
```

---

## 七、命名规范速查

| 类型 | 规则 | 示例 |
|---|---|---|
| 目录名 | kebab-case | `button`、`input-group` |
| 组件文件名 | PascalCase | `Button.vue`、`InputGroup.vue` |
| 组件名 | PascalCase | `Button`、`InputGroup` |
| 模板中使用 | 前缀 + PascalCase | `<CbButton>`、`<CbInputGroup>` |
| CSS 类 | BEM | `.cb-button`、`cb-button__icon`、`cb-button--primary` |
| 类型接口 | PascalCase + Props/Emits/Slots | `ButtonProps` |

---

## 八、检查清单

新增一个组件（如 Modal）需要做：

**方式一：一键生成（推荐）**

- [ ] 运行 `pnpm gen modal 模态框`
- [ ] 补充 `Modal.vue` 的组件逻辑
- [ ] 补充 `types.ts` 的 Props 定义
- [ ] 补充 `docs/components/modal.md` 的 API 表格和示例
- [ ] 运行 `pnpm dev` 验证

**方式二：手动创建**

- [ ] 在 `packages/components/src/modal/` 创建四个文件
- [ ] 运行 `pnpm gen:index` 自动更新入口
- [ ] 创建 `docs/components/modal.md`（API 表格手动编写，或用脚本辅助生成后复制）
- [ ] 运行 `pnpm dev` 验证

---

## 九、Props 文档辅助生成

> **当前方式**：API 表格采用**手动编写**，脚本仅作为辅助生成工具。
> 如需快速生成 API 表格草稿，可先运行脚本，再复制内容到组件文档中。

### 9.1 使用步骤

1. 运行脚本生成 API 表格草稿：

```bash
pnpm extract:props
```

2. 查看生成的文件 `docs/.vitepress/generated/<component>-api.md`

3. 复制表格内容，粘贴到 `docs/components/<component>.md` 的 API 章节中

4. 根据需要手动调整格式

### 9.2 示例

运行 `pnpm extract:props` 后，生成的 `button-api.md` 内容：

```markdown
### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| type | 按钮类型 | `'primary' \| 'default' \| 'danger'` | 'default' |
| size | 按钮尺寸 | `'small' \| 'medium' \| 'large'` | 'medium' |
```

直接复制到 `button.md` 中即可。

### 9.3 脚本位置

| 文件 | 作用 |
|---|---|
| [packages/components/scripts/extract-props.mjs](file:///d:/domexiangm720/CBUi/packages/components/scripts/extract-props.mjs) | 提取脚本入口 |
| `docs/.vitepress/generated/<component>-api.md` | 自动生成的 API 草稿（已在 .gitignore 中忽略） |
