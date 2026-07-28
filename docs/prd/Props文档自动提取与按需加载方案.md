# CB UI 组件库 - Props 文档自动提取与按需加载方案

| 文档名称 | Props 文档自动提取与按需加载方案 |
|---|---|
| 版本 | V1.0.0 |
| 创建日期 | 2026-07-21 |
| 文档状态 | 待评审 |

---

## 一、Props 文档自动提取方案

### 1.1 需求背景

手动编写组件 API 文档效率低下且容易与代码不同步。通过 TypeScript 类型定义和 JSDoc 注释自动生成文档，可以确保：

- 文档与代码同步更新
- 减少重复工作
- 类型定义即文档，保证准确性

### 1.2 技术方案

#### 1.2.1 整体架构

```
┌─────────────────────────────────────────────────────────────┐
│                  Props 文档自动提取流程                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   组件源码                                                    │
│   ├── Button.vue                                             │
│   └── types.ts ──▶ JSDoc 注释                               │
│            │                                                 │
│            ▼                                                 │
│   vite-plugin-dts ──▶ 生成 .d.ts 类型声明文件                │
│            │                                                 │
│            ▼                                                 │
│   typedoc / vitepress-plugin-api ──▶ 提取类型信息            │
│            │                                                 │
│            ▼                                                 │
│   生成 Markdown API 文档 ──▶ 组件文档页面                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### 1.2.2 类型定义规范

**类型文件结构**（`packages/components/src/button/types.ts`）：

```typescript
/** 按钮类型 */
export type ButtonType = 'primary' | 'default' | 'danger'

/** 按钮尺寸 */
export type ButtonSize = 'small' | 'medium' | 'large'

/**
 * 按钮组件属性
 */
export interface ButtonProps {
  /**
   * 按钮类型
   * @default 'default'
   */
  type?: ButtonType

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

  /**
   * 是否加载中
   * @default false
   */
  loading?: boolean

  /**
   * 自定义样式类名
   */
  class?: string

  /**
   * 自定义内联样式
   */
  style?: CSSStyleDeclaration
}

/**
 * 按钮组件事件
 */
export interface ButtonEmits {
  /**
   * 点击按钮时触发
   * @param event 鼠标事件对象
   */
  click: [event: MouseEvent]

  /**
   * 按钮失去焦点时触发
   * @param event 焦点事件对象
   */
  blur: [event: FocusEvent]
}

/**
 * 按钮组件插槽
 */
export interface ButtonSlots {
  /**
   * 按钮内容
   */
  default: () => any
}
```

#### 1.2.3 Vue 组件中的类型引用

```vue
<!-- packages/components/src/button/Button.vue -->
<template>
  <button
    class="cb-button"
    :class="[
      `cb-button--${type}`,
      `cb-button--${size}`,
      { 'is-disabled': disabled || loading },
    ]"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <span v-if="loading" class="cb-button__spinner" />
    <slot />
  </button>
</template>

<script setup lang="ts">
import { withDefaults, defineEmits } from 'vue'
import type { ButtonProps, ButtonEmits } from './types'

const props = withDefaults(defineProps<ButtonProps>(), {
  type: 'default',
  size: 'medium',
  disabled: false,
  loading: false,
})

const emit = defineEmits<ButtonEmits>()

const handleClick = (event: MouseEvent) => {
  if (props.disabled || props.loading) return
  emit('click', event)
}
</script>
```

#### 1.2.4 自动生成 .d.ts 文件

**Vite 配置**（`packages/components/vite.config.ts`）：

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    vue(),
    dts({
      tsconfigPath: './tsconfig.json',
      insertTypesEntry: true,
      copyDtsFiles: true,
      staticImport: true,
    }),
  ],
  build: {
    lib: {
      entry: './src/index.ts',
      name: 'CBUI',
      fileName: (format) => `index.${format}.js`,
      formats: ['es', 'cjs', 'umd'],
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: { vue: 'Vue' },
      },
    },
  },
})
```

**生成的类型声明文件示例**：

```typescript
// dist/button/types.d.ts

/** 按钮类型 */
export type ButtonType = 'primary' | 'default' | 'danger';

/** 按钮尺寸 */
export type ButtonSize = 'small' | 'medium' | 'large';

/**
 * 按钮组件属性
 */
export interface ButtonProps {
  /**
   * 按钮类型
   * @default 'default'
   */
  type?: ButtonType;

  /**
   * 按钮尺寸
   * @default 'medium'
   */
  size?: ButtonSize;
  // ...
}
```

#### 1.2.5 文档提取工具

> **当前实施状态（2026-07-28 更新）**：采用**手动编写 API 表格**方式，脚本仅作为辅助生成工具。
>
> 尝试过 VitePress 内置的 `<<< @/path` 和 `<!-- @include: ./path -->` 两种包含语法，均未能正常渲染为 Markdown 表格（内容被当作代码块或直接消失）。
>
> 当前方案：
> - 辅助脚本：[packages/components/scripts/extract-props.mjs](file:///d:/domexiangm720/CBUi/packages/components/scripts/extract-props.mjs)
> - 使用方式：运行 `pnpm extract:props` 生成 API 草稿，复制到组件文档中手动维护
> - 生成目录：`docs/.vitepress/generated/{component}-api.md`（已在 .gitignore 中忽略）

**方案一：使用 VitePress 内置 `@include` Markdown 包含语法（已尝试，未成功）**

> VitePress 1.x 内置支持 `<!-- @include: ./path -->` 形式的 Markdown 文件包含，但在本项目环境中未能正常渲染。

**方案二：使用 TypeDoc**

```bash
# 安装
pnpm add -D typedoc typedoc-plugin-markdown

# 配置 typedoc.json
{
  "entryPoints": ["packages/components/src/index.ts"],
  "out": "docs/api",
  "plugin": ["typedoc-plugin-markdown"],
  "excludePrivate": true,
  "excludeProtected": true,
  "categorizeByGroup": false,
  "sort": ["enum-value-ascending"]
}

# 生成命令
pnpm typedoc
```

**方案三：自定义脚本提取**

```typescript
// scripts/generate-api-docs.ts
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs'
import { parse } from 'typescript'
import * as ts from 'typescript'

function generateApiDocs(componentPath: string) {
  const content = readFileSync(componentPath, 'utf-8')
  const sourceFile = parse(content)

  const propsInterface = findInterface(sourceFile, 'Props')
  const emitsInterface = findInterface(sourceFile, 'Emits')
  const slotsInterface = findInterface(sourceFile, 'Slots')

  let markdown = ''

  if (propsInterface) {
    markdown += generatePropsTable(propsInterface)
  }

  if (emitsInterface) {
    markdown += generateEventsTable(emitsInterface)
  }

  if (slotsInterface) {
    markdown += generateSlotsTable(slotsInterface)
  }

  return markdown
}

function findInterface(sourceFile: ts.SourceFile, suffix: string): ts.InterfaceDeclaration | undefined {
  let result: ts.InterfaceDeclaration | undefined

  ts.forEachChild(sourceFile, (node) => {
    if (ts.isInterfaceDeclaration(node) && node.name.text.endsWith(suffix)) {
      result = node
    }
  })

  return result
}

function generatePropsTable(interfaceDecl: ts.InterfaceDeclaration): string {
  let table = '\n## Props\n\n| 属性 | 说明 | 类型 | 默认值 |\n|---|---|---|---|\n'

  interfaceDecl.members.forEach((member) => {
    if (ts.isPropertySignature(member)) {
      const name = member.name.getText()
      const type = member.type?.getText() ?? 'any'
      const defaultValue = getDefaultValue(member)
      const description = getJSDocDescription(member)

      table += `| ${name} | ${description} | ${type} | ${defaultValue} |\n`
    }
  })

  return table
}

function getJSDocDescription(node: ts.Node): string {
  const jsDoc = ts.getJSDocComment(node)
  if (!jsDoc) return ''

  const firstTag = jsDoc.tags?.[0]
  if (firstTag?.tagName.text === 'description') {
    return firstTag.comment ?? ''
  }

  return jsDoc.comment?.split('\n')[0] ?? ''
}

function getDefaultValue(node: ts.PropertySignature): string {
  const jsDoc = ts.getJSDocComment(node)
  if (!jsDoc) return '-'

  const defaultTag = jsDoc.tags?.find((tag) => tag.tagName.text === 'default')
  return defaultTag?.comment ?? '-'
}
```

#### 1.2.6 JSDoc 注释规范

| 标签 | 用途 | 示例 |
|---|---|---|
| `@description` | 属性说明 | `@description 按钮类型` |
| `@default` | 默认值 | `@default 'default'` |
| `@param` | 参数说明 | `@param event 鼠标事件对象` |
| `@example` | 使用示例 | `@example <cb-button>Click</cb-button>` |
| `@deprecated` | 废弃标记 | `@deprecated 请使用 size 属性` |
| `@see` | 参考链接 | `@see https://example.com` |

### 1.3 文档生成流程

```bash
# 1. 构建组件库，生成 .d.ts 文件
pnpm build:lib

# 2. 生成 API 文档
pnpm typedoc

# 3. 构建文档站
pnpm build:docs
```

---

## 二、组件按需加载方案

### 2.1 需求背景

全量引入组件库会导致打包体积过大。按需加载可以：

- 只引入使用的组件
- 减少最终打包体积
- 提升首屏加载速度

### 2.2 技术方案

#### 2.2.1 方案对比

| 方案 | 优点 | 缺点 | 适用场景 |
|---|---|---|---|
| 手动按需引入 | 灵活可控 | 代码冗长 | 小项目 |
| unplugin-vue-components 自动引入 | 零配置，自动检测 | 仅支持模板中使用 | 中大型项目 |
| unplugin-auto-import 自动引入 | 支持组合式函数 | 配置较复杂 | 需要自动导入 composables |
| Tree Shaking | 无需额外配置 | 依赖构建工具支持 | 所有项目 |

**推荐方案：unplugin-vue-components + unplugin-auto-import**

#### 2.2.2 组件库入口设计

**全量入口**（`packages/components/src/index.ts`）：

```typescript
import type { App } from 'vue'

import { Button } from './button'
import { Input } from './input'
import { Modal } from './modal'
// ...

export { Button, Input, Modal }

export default {
  install(app: App) {
    const components = [Button, Input, Modal]
    components.forEach((component) => {
      app.component(component.name || component.__name || '', component)
    })
  },
}
```

**单个组件入口**（`packages/components/src/button/index.ts`）：

```typescript
import Button from './Button.vue'
import type { ButtonProps, ButtonType, ButtonSize } from './types'

export { Button }
export type { ButtonProps, ButtonType, ButtonSize }
export default Button
```

**样式入口**（`packages/components/src/button/style.ts`）：

```typescript
import './style.scss'
```

#### 2.2.3 方案一：手动按需引入

**使用方式**：

```typescript
// 手动引入组件
import { Button } from '@cb-ui/components'

// 手动引入样式（方式1：引入组件自带样式）
import '@cb-ui/components/button/style.scss'

// 手动引入样式（方式2：从 dist 引入）
import '@cb-ui/components/dist/button.css'
```

**优点**：
- 完全可控
- 无额外依赖

**缺点**：
- 每次使用都需要引入
- 容易遗漏样式引入

#### 2.2.4 方案二：unplugin-vue-components 自动引入（推荐）

**安装依赖**：

```bash
pnpm add -D unplugin-vue-components unplugin-auto-import
```

**Vite 配置**（`vite.config.ts`）：

```typescript
import { defineConfig } from 'vite'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { CBUIResolver } from './src/resolver'

export default defineConfig({
  plugins: [
    Components({
      resolvers: [
        CBUIResolver({
          importStyle: true,
          prefix: 'cb',
        }),
      ],
    }),
    AutoImport({
      resolvers: [
        CBUIResolver({
          importStyle: false,
        }),
      ],
    }),
  ],
})
```

**自定义 Resolver**（`packages/components/src/resolver.ts`）：

```typescript
import type { ComponentResolver } from 'unplugin-vue-components'

export interface CBUIResolverOptions {
  /**
   * 是否自动导入样式
   * @default true
   */
  importStyle?: boolean

  /**
   * 组件前缀
   * @default 'cb'
   */
  prefix?: string

  /**
   * 组件库名称
   * @default '@cb-ui/components'
   */
  libraryName?: string

  /**
   * 样式文件后缀
   * @default 'scss'
   */
  styleSuffix?: string
}

export function CBUIResolver(options: CBUIResolverOptions = {}): ComponentResolver {
  const {
    importStyle = true,
    prefix = 'cb',
    libraryName = '@cb-ui/components',
    styleSuffix = 'scss',
  } = options

  return {
    type: 'component',
    resolve: (name: string) => {
      if (!name.startsWith(prefix)) return

      const componentName = name.slice(prefix.length)
      const camelCaseName = componentName.charAt(0).toLowerCase() + componentName.slice(1)

      const result = {
        name: componentName,
        from: `${libraryName}/${camelCaseName}`,
      }

      if (importStyle) {
        result.style = `${libraryName}/${camelCaseName}/style.${styleSuffix}`
      }

      return result
    },
  }
}
```

**使用方式**：

```vue
<!-- 模板中直接使用，无需手动导入 -->
<template>
  <CbButton type="primary">主要按钮</CbButton>
  <CbInput v-model="value" />
</template>

<script setup lang="ts">
// 无需手动 import，自动导入
const value = ref('')
</script>
```

**自动生成的代码**：

```typescript
import { CbButton } from '@cb-ui/components/button'
import '@cb-ui/components/button/style.scss'
import { CbInput } from '@cb-ui/components/input'
import '@cb-ui/components/input/style.scss'
```

#### 2.2.5 方案三：unplugin-auto-import 自动导入 Composables

**配置**（`vite.config.ts`）：

```typescript
AutoImport({
  imports: [
    'vue',
    {
      '@cb-ui/components': ['useMessage', 'useNotification'],
    },
  ],
  resolvers: [CBUIResolver()],
  dts: 'src/auto-imports.d.ts',
})
```

**使用方式**：

```typescript
<script setup lang="ts">
// useMessage 自动导入，无需手动 import
useMessage.success('操作成功')
</script>
```

#### 2.2.6 方案四：Tree Shaking

**组件库配置**（`package.json`）：

```json
{
  "type": "module",
  "sideEffects": [
    "*.css",
    "*.scss"
  ]
}
```

**注意事项**：

1. 使用 ES Module 格式（`type: "module"`）
2. 标记样式文件为 side effect
3. 确保组件导出使用纯函数，不产生副作用

**打包工具配置**：

- Vite/Rollup：默认支持，无需额外配置
- Webpack：需要配置 `mode: 'production'` 和 `optimization.usedExports: true`

### 2.3 按需加载性能对比

| 引入方式 | 打包体积（gzip） | 说明 |
|---|---|---|
| 全量引入 | ~200KB | 包含所有组件 |
| 按需引入（Button + Input） | ~30KB | 仅包含使用的组件 |
| 自动引入（Button + Input） | ~30KB | 与手动按需引入相同 |

### 2.4 最佳实践

#### 2.4.1 开发环境配置

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { CBUIResolver } from '@cb-ui/components'

export default defineConfig({
  plugins: [
    Components({
      resolvers: [CBUIResolver({ importStyle: true })],
    }),
    AutoImport({
      resolvers: [CBUIResolver({ importStyle: false })],
    }),
  ],
})
```

#### 2.4.2 生产环境配置

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { CBUIResolver } from '@cb-ui/components'

export default defineConfig({
  plugins: [
    Components({
      resolvers: [CBUIResolver({ importStyle: 'css' })],
      dts: true,
    }),
    AutoImport({
      resolvers: [CBUIResolver({ importStyle: false })],
      dts: true,
    }),
  ],
  build: {
    minify: true,
    rollupOptions: {
      external: ['vue'],
    },
  },
})
```

#### 2.4.3 文档站配置

```typescript
// docs/.vitepress/vite.config.ts
import { defineConfig } from 'vite'
import Components from 'unplugin-vue-components/vite'
import { CBUIResolver } from '../../packages/components/src/resolver'

export default defineConfig({
  plugins: [
    Components({
      resolvers: [CBUIResolver({ importStyle: true })],
    }),
  ],
})
```

---

## 三、集成与验证

### 3.1 文档提取验证

```bash
# 验证类型声明生成
pnpm build:lib && ls -la dist/*.d.ts

# 验证 API 文档生成
pnpm typedoc && ls -la docs/api/

# 验证文档站构建
pnpm build:docs
```

### 3.2 按需加载验证

```bash
# 验证组件导出
pnpm build:lib && node -e "const { Button } = require('./dist/index.cjs.js'); console.log(Button)"

# 验证样式导出
ls -la dist/button/style.css

# 验证自动引入
pnpm dev
# 检查浏览器 Network 是否只加载使用的组件样式
```

---

## 四、注意事项

### 4.1 Props 文档提取

1. **JSDoc 注释必须完整**：缺少注释会导致文档缺失
2. **类型定义必须导出**：未导出的类型无法被提取
3. **默认值标记**：使用 `@default` 标签标记默认值
4. **类型命名规范**：Props 接口以 `Props` 结尾，Events 以 `Emits` 结尾

### 4.2 组件按需加载

1. **样式引入方式**：开发环境用 `.scss`，生产环境用 `.css`
2. **Resolver 配置**：确保 prefix 与组件命名一致
3. **Tree Shaking**：组件库必须使用 ES Module 格式
4. **Side Effects**：样式文件必须标记为 side effect

---

## 五、总结

| 功能 | 方案 | 工具 |
|---|---|---|
| Props 文档自动提取 | JSDoc + TypeScript 类型定义 | vite-plugin-dts + TypeDoc/vitepress-plugin-api |
| 组件按需加载 | unplugin-vue-components 自动引入 | unplugin-vue-components + unplugin-auto-import |
| 样式按需加载 | Resolver 自动引入样式 | 自定义 CBUIResolver |
| Tree Shaking | ES Module + sideEffects 标记 | Vite/Rollup |

通过以上方案，可以实现：

1. **文档自动化**：组件 API 文档从代码自动生成，保证同步更新
2. **按需加载**：只引入使用的组件和样式，减少打包体积
3. **开发体验**：模板中直接使用组件，无需手动导入

这两个方案相互配合，可以大幅提升组件库的开发效率和使用体验。