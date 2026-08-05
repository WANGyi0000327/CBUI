/**
 * 自动生成组件库入口文件
 * 功能：扫描 packages/components/src/ 下的组件目录，
 *       自动重写 packages/components/src/index.ts，无需手动 import/export。
 * 运行：node scripts/generate-index.mjs  或  pnpm gen:index
 */

import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const ROOT = resolve(__dirname, '..')
const SRC_DIR = resolve(ROOT, 'packages/components/src')
const INDEX_FILE = resolve(SRC_DIR, 'index.ts')

/**
 * 扫描组件目录：有 index.ts 且不是 resolver 等非组件目录
 */
function scanComponentDirs() {
  if (!existsSync(SRC_DIR)) return []

  return readdirSync(SRC_DIR)
    .filter((name) => {
      const dirPath = resolve(SRC_DIR, name)
      if (!statSync(dirPath).isDirectory()) return false
      // 排除非组件目录
      if (name === 'resolver') return false
      // 必须有 index.ts 才算组件目录
      return existsSync(resolve(dirPath, 'index.ts'))
    })
    .sort()
}

/**
 * 解析组件 index.ts，提取导出的组件名和类型名
 */
function parseComponentExports(dirName) {
  const indexPath = resolve(SRC_DIR, dirName, 'index.ts')
  const content = readFileSync(indexPath, 'utf-8')

  // 提取 export { ComponentName }
  const compMatch = content.match(/export\s*\{\s*(\w+)\s*\}/)
  const componentName = compMatch ? compMatch[1] : null

  // 提取 export type { TypeA, TypeB }
  const typeMatch = content.match(/export\s+type\s*\{([^}]+)\}/)
  const typeNames = typeMatch
    ? typeMatch[1]
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    : []

  return { dirName, componentName, typeNames }
}

/**
 * 生成 index.ts 内容
 */
function generateIndexContent(components) {
  const lines = []

  lines.push(`/**`)
  lines.push(` * CB UI 组件库全量入口`)
  lines.push(` * ------------------------------------------------------------`)
  lines.push(` * 该文件由 scripts/generate-index.mjs 自动生成，请勿手动修改`)
  lines.push(` * 重新生成命令：pnpm gen:index`)
  lines.push(` */`)
  lines.push(``)
  lines.push(`import type { App } from 'vue'`)
  lines.push(``)
  lines.push(`// 导入组件`)
  for (const c of components) {
    lines.push(`import { ${c.componentName} } from './${c.dirName}'`)
  }

  lines.push(``)
  lines.push(`// 导出组件`)
  lines.push(`export { ${components.map((c) => c.componentName).join(', ')} }`)

  lines.push(``)
  lines.push(`// 导出类型`)
  for (const c of components) {
    if (c.typeNames.length > 0) {
      lines.push(`export type { ${c.typeNames.join(', ')} } from './${c.dirName}'`)
    }
  }

  lines.push(``)
  lines.push(`// 导出 Resolver（用于按需加载）`)
  lines.push(`export { CBUIResolver } from './resolver'`)
  lines.push(`export type { CBUIResolverOptions, ComponentResolver } from './resolver'`)

  lines.push(``)
  lines.push(`const components = [${components.map((c) => c.componentName).join(', ')}]`)
  lines.push(``)
  lines.push(`export const CBUI = {`)
  lines.push(`  install(app: App) {`)
  lines.push(`    components.forEach((component) => {`)
  lines.push(`      const name = (component as { name?: string }).name || (component as { __name?: string }).__name || ''`)
  lines.push(`      if (name) {`)
  lines.push(`        app.component(name, component)`)
  lines.push(`      }`)
  lines.push(`    })`)
  lines.push(`    // 自动初始化 iconfont SVG Sprite`)
  lines.push(`    import('./assets/iconfont/initIconfont').then(({ initIconfont }) => {`)
  lines.push(`      initIconfont()`)
  lines.push(`    })`)
  lines.push(`  },`)
  lines.push(`}`)
  lines.push(``)

  return lines.join('\n')
}

function main() {
  const dirs = scanComponentDirs()
  console.log(`[generate-index] 扫描到 ${dirs.length} 个组件目录`)

  const components = dirs.map(parseComponentExports).filter((c) => c.componentName)

  if (components.length === 0) {
    console.warn('[generate-index] 未找到任何组件，跳过生成')
    return
  }

  const content = generateIndexContent(components)
  writeFileSync(INDEX_FILE, content, 'utf-8')

  console.log(`[generate-index] 已生成 index.ts，包含 ${components.length} 个组件：`)
  for (const c of components) {
    console.log(`  - ${c.dirName} → ${c.componentName}`)
  }
}

main()
