/**
 * CB UI 组件库全量入口
 * ------------------------------------------------------------
 * 该文件由 scripts/generate-index.mjs 自动生成，请勿手动修改
 * 重新生成命令：pnpm gen:index
 */

import type { App } from 'vue'

// 导入组件
import { Button } from './button'
import { ButtonFold } from './button-fold'
import { Copy } from './copy'
import { CountUpNumber } from './count-up-number'
import { CurrencyInput } from './currency-input'
import { DateRangeConfirmPicker } from './date-range-confirm-picker'
import { GridLayout } from './grid-layout'
import { Icon } from './icon'

// 导入指令（v-click-outside 等，供 CbDateRangeConfirmPicker 等组件使用）
import { clickOutside as vClickOutside } from './directives/clickOutside'

// 导出组件
export {
  Button,
  ButtonFold,
  Copy,
  CountUpNumber,
  CurrencyInput,
  DateRangeConfirmPicker,
  GridLayout,
  Icon,
}

// 导出类型
export type {
  ButtonProps,
  ButtonEmits,
  ButtonSlots,
  ButtonType,
  ButtonSize,
  ButtonNativeType,
} from './button'
export type { ButtonFoldProps, ButtonFoldType } from './button-fold'
export type { CopyProps } from './copy'
export type { CountUpNumberProps } from './count-up-number'
export type { CurrencyInputProps, CurrencyInputInstance } from './currency-input'
export type {
  DateRangeConfirmPickerProps,
  DateRangeConfirmPickerEmits,
} from './date-range-confirm-picker'
export type { GridLayoutProps } from './grid-layout'
export type { IconProps } from './icon'

// 导出 Resolver（用于按需加载）
export { CBUIResolver } from './resolver'
export type { CBUIResolverOptions, ComponentResolver } from './resolver'

const components = [
  Button,
  ButtonFold,
  Copy,
  CountUpNumber,
  CurrencyInput,
  DateRangeConfirmPicker,
  GridLayout,
  Icon,
]

export const CBUI = {
  install(app: App) {
    components.forEach((component) => {
      const name =
        (component as { name?: string }).name || (component as { __name?: string }).__name || ''
      if (name) {
        app.component(name, component)
      }
    })
    // 全局注册 v-click-outside 指令（CbDateRangeConfirmPicker 等组件依赖）
    app.directive('click-outside', vClickOutside)
    // 自动初始化 iconfont SVG Sprite
    import('./assets/iconfont/initIconfont').then(({ initIconfont }) => {
      initIconfont()
    })
  },
}
