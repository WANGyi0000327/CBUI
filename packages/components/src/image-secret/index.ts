import { defineComponent, h, type Component } from 'vue'
import RawImageSecret from './ImageSecret.vue'
import type { ImageSecretProps } from './types'

/**
 * 把 Vue SFC 组件放宽成通用 Component 类型（与 copy/index.ts 一致）。
 */
const RawImageSecretComp = RawImageSecret as Component

/**
 * CbImageSecret 包装组件
 * ------------------------------------------------------------
 * 设计原因：
 * 1. 组件库对外统一以 'CbImageSecret' 名称全局注册（resolver 匹配名 / install 注册名一致）。
 * 2. ImageSecret.vue 内部通过 import 引用业务方提供的 serviceManager（来自 #/config/api），
 *    组件库本身不实现该 service，需由业务方在项目中提供 #/config/api 模块。
 * 3. 该组件无 CbIcon 依赖，HOC 结构仅用于统一注册名和 attrs 透传。
 *
 * Props：与 ImageSecret.vue 内部 defineProps 保持一致，此处显式声明以保证 HOC setup
 * 内类型安全（SFC 编译对象的 .props 仅保留运行时校验，无法正确导出 TS 类型）。
 */
const ImageSecret = defineComponent({
  name: 'CbImageSecret',
  inheritAttrs: false,
  props: {
    /** 图片临时路径或 HTTP 链接（必填） */
    tempUrl: {
      type: String,
      required: true,
    },
  },
  setup(props, { attrs, slots }) {
    return () => h(RawImageSecretComp, { ...props, ...attrs }, slots)
  },
})

export { ImageSecret }
export type { ImageSecretProps }
export default ImageSecret
