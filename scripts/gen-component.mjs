/**
 * 一键生成新组件
 * 功能：根据组件名自动生成组件目录、文件、文档，并自动更新入口。
 * 用法：node scripts/gen-component.mjs <组件英文名> [组件中文名]
 * 示例：node scripts/gen-component.mjs modal 模态框
 *       node scripts/gen-component.mjs date-picker 日期选择器
 */

import { mkdirSync, writeFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execSync } from 'node:child_process'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const ROOT = resolve(__dirname, '..')
const SRC_DIR = resolve(ROOT, 'packages/components/src')
const DOCS_DIR = resolve(ROOT, 'docs/components')

// 命令行参数
const rawName = process.argv[2]
const chineseName = process.argv[3] || rawName

if (!rawName) {
  console.error('[gen-component] 错误：缺少组件名')
  console.error('用法：node scripts/gen-component.mjs <组件英文名> [组件中文名]')
  console.error('示例：node scripts/gen-component.mjs modal 模态框')
  process.exit(1)
}

/**
 * kebab-case → PascalCase
 * 如：date-picker → DatePicker
 */
function toPascalCase(kebab) {
  return kebab
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')
}

const dirName = rawName.toLowerCase().replace(/\s+/g, '-')
const pascalName = toPascalCase(dirName)
const compDir = resolve(SRC_DIR, dirName)

if (existsSync(compDir)) {
  console.error(`[gen-component] 错误：组件目录已存在 ${compDir}`)
  process.exit(1)
}

/**
 * 检查 docs/components/ 下是否已有同名文档
 */
const docPath = resolve(DOCS_DIR, `${dirName}.md`)
if (existsSync(docPath)) {
  console.warn(`[gen-component] 警告：文档已存在 ${docPath}`)
}

console.log(`[gen-component] 开始生成组件：${dirName} → ${pascalName}（${chineseName}）`)

// 1. 创建组件目录
mkdirSync(compDir, { recursive: true })

// 2. 生成 types.ts
const typesContent = `/**
 * ${pascalName} 组件属性
 */
export interface ${pascalName}Props {
  /**
   * 自定义样式类名
   * @default ''
   */
  class?: string
  /**
   * 自定义内联样式
   */
  style?: CSSStyleDeclaration
}

/**
 * ${pascalName} 组件事件
 */
export interface ${pascalName}Emits {
  /**
   * 点击时触发
   * @param event 鼠标事件对象
   */
  click: [event: MouseEvent]
}

/**
 * ${pascalName} 组件插槽
 */
export interface ${pascalName}Slots {
  /**
   * 默认内容
   */
  default: () => any
}
`
writeFileSync(resolve(compDir, 'types.ts'), typesContent, 'utf-8')

// 3. 生成 index.ts
const indexContent = `import ${pascalName} from './${pascalName}.vue'
import type { ${pascalName}Props, ${pascalName}Emits, ${pascalName}Slots } from './types'

export { ${pascalName} }
export type { ${pascalName}Props, ${pascalName}Emits, ${pascalName}Slots }
export default ${pascalName}
`
writeFileSync(resolve(compDir, 'index.ts'), indexContent, 'utf-8')

// 4. 生成 style.scss
const styleContent = `@use "@cb-ui/theme/src/variables" as *;

.cb-${dirName} {
  // 组件样式
}
`
writeFileSync(resolve(compDir, 'style.scss'), styleContent, 'utf-8')

// 5. 生成 Component.vue
const vueContent = `<template>
  <div class="cb-${dirName}">
    <slot />
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'Cb${pascalName}' })

import type { ${pascalName}Props } from './types'

withDefaults(defineProps<${pascalName}Props>(), {})
</script>

<style scoped lang="scss">
@use "@cb-ui/theme/src/variables" as *;

.cb-${dirName} {
  // 组件样式
}
</style>
`
writeFileSync(resolve(compDir, `${pascalName}.vue`), vueContent, 'utf-8')

// 6. 生成文档
const docContent = `---
title: ${pascalName} ${chineseName}
description: ${chineseName}组件描述。
---

# ${pascalName} ${chineseName}

${chineseName}组件描述。

## 基础用法

<DemoBlock>
  <Cb${pascalName}>内容</Cb${pascalName}>

  <template #code>

\`\`\`vue
<template>
  <Cb${pascalName}>内容</Cb${pascalName}>
</template>
\`\`\`

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
`
writeFileSync(docPath, docContent, 'utf-8')

console.log(`[gen-component] 组件文件已生成：`)
console.log(`  - packages/components/src/${dirName}/${pascalName}.vue`)
console.log(`  - packages/components/src/${dirName}/types.ts`)
console.log(`  - packages/components/src/${dirName}/index.ts`)
console.log(`  - packages/components/src/${dirName}/style.scss`)
console.log(`  - docs/components/${dirName}.md`)

// 7. 自动生成入口 index.ts
console.log(`[gen-component] 正在更新组件库入口...`)
try {
  execSync('node scripts/generate-index.mjs', { cwd: ROOT, stdio: 'inherit' })
} catch (e) {
  console.error('[gen-component] 入口更新失败，请手动运行：node scripts/generate-index.mjs')
}

console.log(`[gen-component] 完成！`)
console.log(`提示：侧边栏已配置为自动扫描，无需手动修改 config.ts`)
