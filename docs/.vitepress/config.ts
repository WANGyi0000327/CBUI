import { defineConfig } from 'vitepress'
import { resolve, basename } from 'path'
import { readdirSync, readFileSync, existsSync } from 'fs'

/**
 * 自动扫描 docs/components/ 目录，生成侧边栏配置
 * 从每个 .md 文件的 frontmatter 中读取 title 作为显示文本
 *
 * 组件分为三类：
 * - 基础组件：通用 UI 原子/布局/反馈，无业务依赖（按钮、弹窗、布局、输入等）
 * - 媒体与工具：面向特定内容类型或提供独立工具能力的中间层组件
 *   （媒体播放、图片安全展示、复制/动画/渲染包装等），不依赖业务服务
 * - 业务组件：依赖具体业务场景或数据服务（表格列设置、文件预览、上传、筛选、商品图等）
 */
// 媒体与工具：有独立能力、不依赖业务，但也不是纯 UI 原子
const MEDIA_TOOL_COMPONENTS = new Set([
  'audio-player', // CbAudioPlayer 音频播放器（媒体播放）
  'video-player', // CbVideoPlayer 视频播放器（媒体播放）
  'image-secret', // ImageSecret 密钥图片（图片安全展示）
  'copy', // Copy 复制（工具）
  'count-up-number', // CountUpNumber 数字动画（工具）
  'render-component', // RenderComponent 渲染函数包装器（工具）
])
// 业务：依赖具体业务场景或数据服务
const BUSINESS_COMPONENTS = new Set([
  'col-control', // CbColControl 列设置（远程保存）
  'column-control', // CbColumnControl 列控制（远程保存）
  'dynamic-form-generator', // CbDynamicFormGenerator 动态表单（schema 驱动）
  'file-preview', // CbFilepreview 文件预览（临时 URL 服务）
  'file-preview-v2', // CbFilePreviewV2 附件图片预览
  'filter-popup', // CbFilterPopup 筛选弹层
  'search-filter', // CbSearchFilter 筛选弹层
  'good-main-image', // CbGoodMainImage 商品主图
  'upload', // CbUpload 上传（上传服务）
  'voice-to-text', // CbVoiceToText 音频转文字（转写服务）
  'preview-image', // CbPreviewImage 预览图片（图片服务）
  'permission-tree', // CbPermissionTree 权限树（权限数据）
  'public-table', // CbPublicTable 公开表格（业务表格）
])
// 基础组件子分组（按功能细分，md 文件名）
const BASE_SUBGROUPS: Array<{ text: string; keys: string[] }> = [
  {
    text: '按钮与操作',
    keys: ['button', 'button-fold', 'over-btns'],
  },
  {
    text: '输入与选择',
    keys: [
      'numeric-input',
      'overflow-input',
      'over-limit-input-number',
      'currency-input',
      'multiple-select',
      'date-range-confirm-picker',
      'time-select',
      'time-select-line',
      'search',
      'search-input',
    ],
  },
  {
    text: '数据展示',
    keys: ['status-tag', 'tags', 'tag-bar', 'tag-img', 'tabs'],
  },
  {
    text: '布局与容器',
    keys: [
      'grid-layout',
      'page-layout',
      'collapse-sidebar',
      'common-dialog',
      'more-popup',
      'pagination',
      'icon',
    ],
  },
]

function getComponentSidebarItems() {
  const componentsDir = resolve(__dirname, '../components')
  if (!existsSync(componentsDir)) return []

  const items = readdirSync(componentsDir)
    .filter((name) => name.endsWith('.md'))
    .map((name) => {
      const filePath = resolve(componentsDir, name)
      const base = basename(name, '.md')

      // 尝试从 frontmatter 读取 title
      let text = base
      try {
        const content = readFileSync(filePath, 'utf-8')
        const match = content.match(/^---\s*\ntitle:\s*(.+?)\n/m)
        if (match) text = match[1].trim()
      } catch {
        // 忽略读取错误，使用文件名
      }

      return { text, link: `/components/${base}`, _base: base }
    })

  // 分类
  const baseItems = items
    .filter(
      (item) => !MEDIA_TOOL_COMPONENTS.has(item._base) && !BUSINESS_COMPONENTS.has(item._base)
    )
    .sort((a, b) => a.text.localeCompare(b.text, 'zh-CN'))
  const mediaItems = items
    .filter((item) => MEDIA_TOOL_COMPONENTS.has(item._base))
    .sort((a, b) => a.text.localeCompare(b.text, 'zh-CN'))
    .map(({ text, link }) => ({ text, link }))
  const businessItems = items
    .filter((item) => BUSINESS_COMPONENTS.has(item._base))
    .sort((a, b) => a.text.localeCompare(b.text, 'zh-CN'))
    .map(({ text, link }) => ({ text, link }))

  // 基础组件按功能子分组
  const byKey = new Map(items.map((i) => [i._base, i]))
  const baseGroups = BASE_SUBGROUPS.map((group) => ({
    text: group.text,
    items: group.keys
      .map((k) => byKey.get(k))
      .filter((i) => i)
      .map(({ text, link }) => ({ text, link })),
  }))
  // 未登记进任何子分组的基础组件 → 归入「未分组」（避免新增组件在侧边栏无处显示）
  const groupedKeys = new Set(BASE_SUBGROUPS.flatMap((g) => g.keys))
  const unGroupedBase = baseItems.filter((i) => !groupedKeys.has(i._base))
  const baseSidebarItems = unGroupedBase.length
    ? [...baseGroups, { text: '未分组', items: unGroupedBase }]
    : baseGroups

  return [
    { text: '基础组件', items: baseSidebarItems },
    { text: '媒体与工具', items: mediaItems },
    { text: '业务组件', items: businessItems },
  ]
}

// VitePress 配置
// 文档站点核心配置：导航、侧边栏、主题、Vite 增强
// 备注：Props API 文档自动提取使用 VitePress 内置的 @include 包含语法
//       <!-- @include: ./.vitepress/generated/<component>-api.md -->
//       （参见 https://vitepress.dev/guide/markdown#markdown-file-inclusion）
//       API 片段由 packages/components/scripts/extract-props.mjs 生成
//       命令：pnpm extract:props（已自动接入 dev / build）
export default defineConfig({
  title: 'CB UI',
  description: '基于 Vue3 + TypeScript + VitePress + TailwindCSS + Sass 的前端组件库',
  base: '/',
  lang: 'zh-CN',
  // 关闭页面底部的「上次更新时间 Last updated」显示
  lastUpdated: false,
  cleanUrls: true,

  // 主题配置
  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'CB UI',

    // 顶部导航
    nav: [
      { text: '指南', link: '/guide/intro', activeMatch: '/guide/' },
      { text: '组件', link: '/components/button', activeMatch: '/components/' },
      { text: 'PRD', link: '/prd/组件库文档站PRD', activeMatch: '/prd/' },
    ],

    // 侧边栏
    sidebar: {
      '/guide/': [
        {
          text: '开始',
          items: [
            { text: '介绍', link: '/guide/intro' },
            { text: '快速上手', link: '/guide/quickstart' },
            { text: '新组件开发', link: '/guide/new-component' },
            { text: '组件开发指南', link: '/guide/component-guide' },
            { text: '常见问题', link: '/guide/faq' },
          ],
        },
      ],
      '/components/': getComponentSidebarItems(),
      '/prd/': [
        {
          text: '产品文档',
          items: [
            { text: '组件库文档站 PRD', link: '/prd/组件库文档站PRD' },
            { text: '技术选型方案', link: '/prd/技术选型方案' },
            { text: 'Props 自动提取与按需加载方案', link: '/prd/Props文档自动提取与按需加载方案' },
            { text: '技术文档结构说明', link: '/prd/技术文档结构说明' },
          ],
        },
      ],
    },

    // 社交链接
    socialLinks: [{ icon: 'github', link: 'https://github.com/your-org/cb-ui' }],

    // 搜索
    search: {
      provider: 'local',
    },

    // 页脚
    footer: {
      message: '基于 MIT 协议发布',
      copyright: 'Copyright © 2026 CB UI',
    },

    // 上一页/下一页
    docFooter: {
      prev: '上一页',
      next: '下一页',
    },
  },

  // Vite 配置增强
  vite: {
    // ========== JSX / TSX 编译配置（关键：独立于 tsconfig，必须显式指定）==========
    // CbButton 等组件使用 <script setup lang="tsx"> 写 JSX（如 <cb-icon name="..." />）
    // 默认 esbuild 按 React 运行时编译 → 生成 React.createElement，浏览器报 React is not defined
    // 这里指定 vue 作为 JSX 运行时入口，与 tsconfig.base.json 中 "jsxImportSource": "vue" 保持一致
    esbuild: {
      jsx: 'automatic',
      jsxImportSource: 'vue',
    },
    resolve: {
      alias: {
        // 文档站直接引用本地组件源码，便于实时预览
        '@cb-ui/components': resolve(__dirname, '../../packages/components/src'),
        // 注意：theme 指向 packages/theme 目录（不带 src），这样 @cb-ui/theme/src/variables 能正确解析
        '@cb-ui/theme': resolve(__dirname, '../../packages/theme'),
        '@cb-ui/utils': resolve(__dirname, '../../packages/utils/src'),
        // CbImageSecret 等组件内部 import { serviceManager } from '#/config/api'
        // 把 # 指向组件库 src 目录，使用 config/api.ts shim 作为 mock
        '#': resolve(__dirname, '../../packages/components/src'),
        // pdfjs-dist 引用 Node 原生 canvas（Node 端渲染用），docs 应用构建解析为空 stub
        canvas: resolve(__dirname, './canvas-stub.js'),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          // 使用 Sass modern-compiler API，消除 legacy-js-api 弃用警告
          // 依赖 sass >= 1.79（当前 1.101.3 满足）
          api: 'modern-compiler',
          // 自动注入 Sass 变量，组件无需单独 @use
          additionalData: `@use "@cb-ui/theme/src/variables" as *;`,
        },
      },
    },
    server: {
      // 监听所有网卡：dev server 同时暴露 Localhost 与 Network（局域网 IP）地址
      // 便于手机/其他设备通过 http://<局域网IP>:5173 访问文档站
      host: true,
    },
  },
})
