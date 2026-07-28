/**
 * Props 文档自动提取脚本
 * 功能：扫描 components/src 子目录中的 types.ts 文件，
 *       解析 JSDoc 注释与 TypeScript 类型定义，
 *       生成 Markdown 格式的 API 文档片段到 docs/.vitepress/generated/。
 * 运行：node scripts/extract-props.mjs  或  pnpm extract:props
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'node:fs'
import { resolve, dirname, basename } from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// 路径配置：脚本位于 packages/components/scripts/，需回退三级到仓库根
const ROOT = resolve(__dirname, '../../..')
const COMPONENTS_DIR = resolve(ROOT, 'packages/components/src')
const OUTPUT_DIR = resolve(ROOT, 'docs/.vitepress/generated')

/**
 * 扫描 components/src 下各子目录中的 types.ts
 */
function findTypesFiles() {
  if (!existsSync(COMPONENTS_DIR)) return []
  return readdirSync(COMPONENTS_DIR)
    .map((name) => resolve(COMPONENTS_DIR, name, 'types.ts'))
    .filter((p) => existsSync(p))
}

/**
 * 从 JSDoc 注释中提取 @default 标签
 */
function extractDefaultFromJSDoc(jsDocLines) {
  for (const line of jsDocLines) {
    const m = line.match(/@default\s+(.+)/)
    if (m) return m[1].trim()
  }
  return '-'
}

/**
 * 从 JSDoc 注释行中提取纯描述（移除所有 @tag 及其后内容）
 * jsDocLines 是形如 JSDoc 起始、若干星号行、JSDoc 结束的数组
 */
function cleanDescription(jsDocLines) {
  const descs = []
  for (const line of jsDocLines) {
    // 去掉 JSDoc 起始 /** 与结束 */ 包裹
    let l = line
      .replace(/^\s*\/\*\*\s?/, '')
      .replace(/\s?\*\/\s*$/, '')
      .trim()
    // 去掉行首的 * 前缀（多行 JSDoc 中的星号）
    l = l.replace(/^\*\s?/, '')
    if (!l) continue
    // 遇到 @tag 整行跳过
    if (l.startsWith('@')) continue
    descs.push(l)
  }
  return descs.join(' ').trim() || '-'
}

/**
 * 简单解析 types.ts 文件
 */
function parseTypesFile(filePath) {
  const content = readFileSync(filePath, 'utf-8')
  const lines = content.split('\n')

  const componentName = basename(dirname(filePath)).replace(/^./, (c) => c.toUpperCase())

  const api = { componentName, props: [], events: [], slots: [] }

  // 收集 type 别名：保留带空格的字面量联合，例如 'primary' | 'default' | 'danger'
  const typeMap = new Map()
  for (const line of lines) {
    const aliasMatch = line.match(/export\s+type\s+(\w+)\s*=\s*(.+?)(?:\s*)$/)
    if (aliasMatch) {
      const [, name, value] = aliasMatch
      // 提取字面量联合：在 '... ' 之间的内容
      const literals = [...value.matchAll(/'([^']*)'/g)].map((m) => `'${m[1]}'`)
      if (literals.length > 0) {
        typeMap.set(name, literals.join(' | '))
      } else {
        typeMap.set(name, value.trim())
      }
    }
  }

  let currentInterface = null
  let inJSDoc = false
  let jsDocLines = [] // 当前累积的 JSDoc 注释行

  const flushJSDoc = () => {
    // 收尾处理
    inJSDoc = false
    jsDocLines = []
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const trimmed = line.trim()

    // JSDoc 开始 /** 或 * 行
    if (trimmed.startsWith('/**')) {
      inJSDoc = true
      jsDocLines = [line]
      // 单行 /** ... */ 形式
      if (trimmed.endsWith('*/') && trimmed.length > 4) {
        // 这里不需要立即 flush，等下一个非 JSDoc 行时统一用
      }
      continue
    }

    if (inJSDoc) {
      jsDocLines.push(line)
      if (trimmed.endsWith('*/')) {
        inJSDoc = false
      }
      continue
    }

    // 接口声明
    const ifaceMatch = line.match(/export\s+interface\s+(\w+)\s*\{?/)
    if (ifaceMatch) {
      const name = ifaceMatch[1]
      if (name.endsWith('Props')) currentInterface = 'Props'
      else if (name.endsWith('Emits')) currentInterface = 'Emits'
      else if (name.endsWith('Slots')) currentInterface = 'Slots'
      else currentInterface = null
      flushJSDoc()
      continue
    }

    if (trimmed === '}' && currentInterface) {
      currentInterface = null
      flushJSDoc()
      continue
    }

    if (currentInterface && trimmed && !trimmed.startsWith('//')) {
      if (currentInterface === 'Props') {
        const propMatch = trimmed.match(/^(\w+)(\?)?:\s*(.+)$/)
        if (propMatch) {
          const [, propName, , typeStr] = propMatch
          const resolvedType = resolveTypeString(typeStr.trim(), typeMap)
          const defaultVal = extractDefaultFromJSDoc(jsDocLines)
          const description = cleanDescription(jsDocLines)
          api.props.push({ name: propName, description, type: resolvedType, defaultValue: defaultVal })
          flushJSDoc()
          continue
        }
      } else if (currentInterface === 'Emits') {
        // event key 允许 'update:modelValue' 这种带引号、含冒号的
        const eventMatch = trimmed.match(/^(?:'([^']+)'|"([^"]+)"|(\w+))\s*:\s*\[(.+?)\]\s*$/)
        if (eventMatch) {
          const eventName = eventMatch[1] || eventMatch[2] || eventMatch[3]
          const paramsStr = eventMatch[4]
          const params = resolveTupleParams(paramsStr, typeMap)
          const description = cleanDescription(jsDocLines)
          api.events.push({ name: eventName, description, params })
          flushJSDoc()
          continue
        }
        const noArgMatch = trimmed.match(/^(?:'([^']+)'|"([^"]+)"|(\w+))\s*:\s*\[\s*\]\s*$/)
        if (noArgMatch) {
          const eventName = noArgMatch[1] || noArgMatch[2] || noArgMatch[3]
          const description = cleanDescription(jsDocLines)
          api.events.push({ name: eventName, description, params: '' })
          flushJSDoc()
          continue
        }
      } else if (currentInterface === 'Slots') {
        // slot 名称也允许 'header' 这种
        const slotMatch = trimmed.match(/^(?:'([^']+)'|"([^"]+)"|(\w+))\s*\??:\s*\(/)
        if (slotMatch) {
          const slotName = slotMatch[1] || slotMatch[2] || slotMatch[3]
          const description = cleanDescription(jsDocLines)
          api.slots.push({ name: slotName, description })
          flushJSDoc()
          continue
        }
      }
      // 未能匹配的行：清空 jsDoc 防止串味
      flushJSDoc()
    } else if (currentInterface && !trimmed) {
      // 空行不处理
    } else if (!currentInterface) {
      // 顶层结构外，遇到非 JSDoc、非空行：清空 JSDoc
      flushJSDoc()
    }
  }

  return api
}

function resolveTypeString(typeStr, typeMap) {
  if (typeStr.includes("'")) return typeStr
  if (typeMap.has(typeStr)) return typeMap.get(typeStr)
  if (typeStr.includes('|')) return typeStr
  return typeStr
}

function resolveTupleParams(paramsStr, typeMap) {
  const simpleMatch = paramsStr.match(/^\(?(\w+):\s*(\w+)\)?$/)
  if (simpleMatch) {
    const [, , typeName] = simpleMatch
    return typeMap.get(typeName) || typeName
  }
  return paramsStr.trim()
}

/**
 * 渲染为 Markdown
 */
function renderApiMarkdown(api) {
  const lines = []
  lines.push('<!-- 该文件由 scripts/extract-props.mjs 自动生成，请勿手动修改 -->')
  lines.push('<!-- 重新生成命令：pnpm extract:props -->')
  lines.push('')

  // 表格内出现的 | 必须转义为 \|，否则破坏 Markdown 表格
  const escape = (s) => String(s).replace(/\|/g, '\\|')

  lines.push('### Props')
  lines.push('')
  if (api.props.length === 0) {
    lines.push('暂无 Props 定义。')
    lines.push('')
  } else {
    lines.push('| 属性 | 说明 | 类型 | 默认值 |')
    lines.push('| --- | --- | --- | --- |')
    for (const prop of api.props) {
      lines.push(`| ${escape(prop.name)} | ${escape(prop.description)} | \`${escape(prop.type)}\` | ${escape(prop.defaultValue)} |`)
    }
    lines.push('')
  }

  lines.push('### Events')
  lines.push('')
  if (api.events.length === 0) {
    lines.push('暂无 Events 定义。')
    lines.push('')
  } else {
    lines.push('| 事件名 | 说明 | 回调参数 |')
    lines.push('| --- | --- | --- |')
    for (const event of api.events) {
      const params = event.params ? `\`${escape(event.params)}\`` : '-'
      lines.push(`| ${escape(event.name)} | ${escape(event.description)} | ${params} |`)
    }
    lines.push('')
  }

  lines.push('### Slots')
  lines.push('')
  if (api.slots.length === 0) {
    lines.push('暂无 Slots 定义。')
    lines.push('')
  } else {
    lines.push('| 插槽名 | 说明 |')
    lines.push('| --- | --- |')
    for (const slot of api.slots) {
      lines.push(`| ${escape(slot.name)} | ${escape(slot.description)} |`)
    }
    lines.push('')
  }

  return lines.join('\n')
}

function main() {
  if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true })
  }

  const files = findTypesFiles()
  console.log(`[extract-props] 找到 ${files.length} 个 types.ts 文件`)

  for (const file of files) {
    const componentDir = basename(dirname(file))
    const api = parseTypesFile(file)
    const markdown = renderApiMarkdown(api)
    const outputFile = resolve(OUTPUT_DIR, `${componentDir}-api.md`)

    writeFileSync(outputFile, markdown, 'utf-8')
    console.log(`[extract-props] 已生成 ${componentDir}-api.md (${api.props.length} props, ${api.events.length} events, ${api.slots.length} slots)`)
  }

  console.log(`[extract-props] 完成！文档已生成到 ${OUTPUT_DIR}`)
}

main()
