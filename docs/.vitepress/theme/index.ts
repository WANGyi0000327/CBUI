import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'

// 引入组件库（样式在组件 SFC 内部）
import { CBUI } from '@cb-ui/components'

// 引入主题 CSS 变量
import '@cb-ui/theme/src/index.css'

// 引入 Tailwind
import './tailwind.css'

// 引入自定义样式
import './style.scss'

// 文档站公共组件
import DemoBlock from '../components/DemoBlock.vue'

// 主题入口
// 扩展 VitePress 默认主题，注册组件库与文档站组件
export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // 注册组件库（全量引入）
    app.use(CBUI)
    // 注册文档站公共组件
    app.component('DemoBlock', DemoBlock)

    // 客户端环境加载 iconfont SVG Sprite
    // VitePress 使用 SSR，服务端无 window/document，需判断后再加载
    if (typeof window !== 'undefined') {
      import('@cb-ui/components/config/iconfont.js').then(() => {
        // 阿里 iconfont 新版 js 仅将 SVG string 赋值给 window._iconfont_svg_string_xxx
        // 需手动将 SVG 注入到 DOM 中，<use xlink:href="#icon-xxx"> 才能引用到 symbol
        const keys = Object.keys(window).filter((k) => k.startsWith('_iconfont_svg_string_'))
        keys.forEach((k) => {
          const svgStr = (window as Record<string, unknown>)[k] as string
          if (svgStr && !document.getElementById(k)) {
            const div = document.createElement('div')
            div.id = k
            div.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden'
            div.innerHTML = svgStr
            document.body.insertBefore(div, document.body.firstChild)
          }
        })
      })
    }
  },
} satisfies Theme
