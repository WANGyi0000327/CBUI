/**
 * pdfjs-dist Node 原生 canvas 依赖的浏览器空 stub
 * pdfjs-dist/build/pdf.js 在 Node 环境下 require('canvas') 用于服务端渲染，
 * 浏览器端不需要该能力；docs（VitePress 应用构建）将 canvas 解析到此空模块，
 * 避免 rollup 尝试解析 ../build/Release/canvas.node 导致构建失败。
 * 注意：须为 ESM 导出（docs 构建以 ESM 处理 alias 目标）。
 */
export default {}
