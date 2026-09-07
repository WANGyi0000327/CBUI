import type { Config } from 'tailwindcss'
import { resolve } from 'path'

// 根 TailwindCSS 配置
// 扫描所有组件与文档站的 Vue/TS/Markdown 文件
// 注意：content 路径必须用 __dirname 解析为绝对路径！
// 原因：当 pnpm -F docs build 运行时，cwd 是 docs/ 目录，
// 相对路径 ./packages/... 会被解析成 docs/packages/...（不存在），
// 导致 Tailwind 警告 "No utility classes were detected"，不生成任何工具类 CSS。
// 用 __dirname 确保路径始终相对于本配置文件所在的项目根目录。
const config: Config = {
  content: [
    // 只扫描文档站源文件，排除 node_modules
    resolve(__dirname, 'docs/.vitepress/**/*.{vue,ts,md}'),
    resolve(__dirname, 'docs/components/*.md'),
    resolve(__dirname, 'docs/guide/*.md'),
    resolve(__dirname, 'docs/prd/*.md'),
    // 组件库源码
    resolve(__dirname, 'packages/components/src/**/*.{vue,ts}'),
  ],
  // 引入自定义预设，统一设计 token（颜色、圆角等）
  presets: [require('./packages/theme/src/tailwind.preset.js')],
  corePlugins: {
    // 组件库不污染全局 reset，由业务方决定是否引入 preflight
    preflight: false,
  },
}

export default config
