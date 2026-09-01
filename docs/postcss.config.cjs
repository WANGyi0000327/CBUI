// PostCSS 配置
// TailwindCSS 需要 PostCSS 处理
const path = require('path')

// 显式传入根 tailwind.config.ts 路径：Tailwind 在 PostCSS 上下文里默认从被处理文件
// 目录向上查找配置，可能漏掉根目录的 .ts 配置，导致 "content missing or empty" 警告。
// 这里直接指定路径，让 Tailwind 走自身加载器（内置 jiti，支持 .ts）读取完整 content。
module.exports = {
  plugins: {
    tailwindcss: {
      config: path.resolve(__dirname, '../tailwind.config.ts'),
    },
    autoprefixer: {},
  },
}
