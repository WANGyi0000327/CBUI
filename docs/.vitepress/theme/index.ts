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
  },
} satisfies Theme
