/**
 * CB UI 组件库全量入口
 * ------------------------------------------------------------
 * 该文件由 scripts/generate-index.mjs 自动生成，请勿手动修改
 * 重新生成命令：pnpm gen:index
 */

import type { App } from 'vue'

// 导入组件
import { Button } from './button'
import { Copy } from './copy'
import { Icon } from './icon'

// 导出组件
export { Button, Copy, Icon }

// 导出类型
export type { ButtonProps, ButtonEmits, ButtonSlots, ButtonType, ButtonSize, ButtonNativeType } from './button'
export type { CopyProps } from './copy'
export type { IconProps } from './icon'

// 导出 Resolver（用于按需加载）
export { CBUIResolver } from './resolver'
export type { CBUIResolverOptions, ComponentResolver } from './resolver'

const components = [Button, Copy, Icon]

export const CBUI = {
  install(app: App) {
    components.forEach((component) => {
      const name = (component as { name?: string }).name || (component as { __name?: string }).__name || ''
      if (name) {
        app.component(name, component)
      }
    })
    // 自动初始化 iconfont SVG Sprite
    import('./assets/iconfont/initIconfont').then(({ initIconfont }) => {
      initIconfont()
    })
  },
}
