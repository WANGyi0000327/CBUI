import { defineConfig } from 'vitepress'
import { resolve } from 'path'

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
  lastUpdated: true,
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
            { text: '组件开发指南', link: '/guide/component-guide' },
            { text: '常见问题', link: '/guide/faq' },
          ],
        },
      ],
      '/components/': [
        {
          text: '基础组件',
          items: [
            { text: 'Button 按钮', link: '/components/button' },
            { text: 'Input 输入框', link: '/components/input' },
            { text: 'Card 卡片', link: '/components/card' },
          ],
        },
      ],
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
    resolve: {
      alias: {
        // 文档站直接引用本地组件源码，便于实时预览
        '@cb-ui/components': resolve(__dirname, '../../packages/components/src'),
        // 注意：theme 指向 packages/theme 目录（不带 src），这样 @cb-ui/theme/src/variables 能正确解析
        '@cb-ui/theme': resolve(__dirname, '../../packages/theme'),
        '@cb-ui/utils': resolve(__dirname, '../../packages/utils/src'),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          // 使用现代 API，避免 legacy 警告
          api: 'modern-compiler',
          // 自动注入 Sass 变量，组件无需单独 @use
          additionalData: `@use "@cb-ui/theme/src/variables" as *;`,
        },
      },
    },
  },
})
