/**
 * CB UI 组件库全量入口
 * ------------------------------------------------------------
 * 该文件由 scripts/generate-index.mjs 自动生成，请勿手动修改
 * 重新生成命令：pnpm gen:index
 */

import type { App } from 'vue'

// 导入组件
import Button from './button'
import Card from './card'
import DatePicker from './date-picker'
import Icon from './icon'
import Input from './input'
import Modal from './modal'

// 导出组件
export { Button, Card, DatePicker, Icon, Input, Modal }

// 导出类型
export type {
  ButtonProps,
  ButtonEmits,
  ButtonSlots,
  ButtonType,
  ButtonSize,
  ButtonNativeType,
} from './button'
export type {
  CardProps,
  CardEmits,
  CardSlots,
  AddCartEventPayload,
  ProductHallListType,
} from './card'
export type { DatePickerProps, DatePickerEmits, DatePickerSlots } from './date-picker'
export type { IconProps } from './icon'
export type { InputProps, InputEmits, InputSlots, InputSize } from './input'
export type { ModalProps, ModalEmits, ModalSlots } from './modal'

// 导出 Resolver（用于按需加载）
export { CBUIResolver } from './resolver'
export type { CBUIResolverOptions, ComponentResolver } from './resolver'

const components = [Button, Card, DatePicker, Icon, Input, Modal]

export const CBUI = {
  install(app: App) {
    components.forEach((component) => {
      const name =
        (component as { name?: string }).name || (component as { __name?: string }).__name || ''
      if (name) {
        app.component(name, component)
      }
    })
  },
}
