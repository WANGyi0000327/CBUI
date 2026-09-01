/**
 * iconfont SVG Sprite 自动初始化
 * ------------------------------------------------------------
 * 由 CBUI.install 自动调用。阿里 iconfont 新版 js 仅将 SVG 字符串赋值给
 * window._iconfont_svg_string_{projectId}，需手动注入到 DOM，
 * <use xlink:href="#icon-xxx"> 才能引用到 symbol。
 *
 * 仅在浏览器环境执行（SSR 无 window/document）。
 */
export function initIconfont() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return

  // 相对路径指向 src/config/iconfont.js（packages/components/tsconfig 未配 @cb-ui 别名）。
  // tsconfig 默认 allowJs:false，相对 import .js 会触发 TS2307，用 @ts-expect-error 抑制；
  // 运行时由 Vite 解析到实际文件并执行 side-effect（iconfont.js 无导出）。
  // @ts-expect-error iconfont.js 为 side-effect 模块，allowJs:false 下 TS 无法解析
  import('../../config/iconfont.js').then(() => {
    const w = window as unknown as Record<string, unknown>
    const keys = Object.keys(w).filter((k) => k.startsWith('_iconfont_svg_string_'))
    keys.forEach((k) => {
      const svgStr = w[k] as string
      // 兼容 DOMContentLoaded 前 body 尚未挂载的场景
      if (svgStr && !document.getElementById(k) && document.body) {
        const div = document.createElement('div')
        div.id = k
        div.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden'
        div.innerHTML = svgStr
        document.body.insertBefore(div, document.body.firstChild)
      }
    })
  })
}
