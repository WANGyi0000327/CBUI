import type { Config } from 'tailwindcss'

// 根 TailwindCSS 配置
// 扫描所有组件与文档站的 Vue/TS/Markdown 文件
const config: Config = {
  content: [
    './docs/.vitepress/**/*.{vue,ts,md}',
    './docs/**/*.{vue,ts,md}',
    './packages/components/src/**/*.{vue,ts}',
  ],
  // 引入自定义预设，统一设计 token（颜色、圆角等）
  presets: [require('./packages/theme/src/tailwind.preset.js')],
  corePlugins: {
    // 组件库不污染全局 reset，由业务方决定是否引入 preflight
    preflight: false,
  },
}

export default config
