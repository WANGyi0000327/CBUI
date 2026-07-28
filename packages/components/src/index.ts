/**
 * CB UI 组件库全量入口
 * ------------------------------------------------------------
 * 此文件为组件库的主入口，导出所有组件、类型与安装方法
 */
import type { App } from 'vue'

// 导入组件
import { Button } from './button'
import { Input } from './input'
import { Card } from './card'

// 导出组件
export { Button, Input, Card }

// 导出类型
export type { ButtonProps, ButtonEmits, ButtonSlots, ButtonType, ButtonSize, ButtonNativeType } from './button'
export type { InputProps, InputEmits, InputSlots, InputSize } from './input'
export type { CardProps, CardEmits, CardSlots } from './card'

// 导出 Resolver（用于按需加载）
export { CBUIResolver } from './resolver'
export type { CBUIResolverOptions, ComponentResolver } from './resolver'

// 组件列表
const components = [Button, Input, Card]

/**
 * Vue 插件安装方法
 * @example
 * import { CBUI } from '@cb-ui/components'
 * app.use(CBUI)
 */
export const CBUI = {
  install(app: App) {
    components.forEach((component) => {
      const name = (component as any).name || (component as any).__name || ''
      if (name) {
        app.component(name, component)
      }
    })
  },
}
