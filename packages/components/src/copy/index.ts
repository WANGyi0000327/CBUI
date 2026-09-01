import { defineComponent, getCurrentInstance, h, type Component } from 'vue'
import RawCopy from './Copy.vue'
import Icon from '../icon'
import type { CopyProps } from './types'

/**
 * 把 Vue SFC 组件放宽成通用 Component 类型（与 button/index.ts 一致）。
 * 直接 `as DefineComponent` 会因泛型参数不匹配触发 TS2352，用 `as Component` 更宽松。
 */
const IconComp = Icon as Component
const RawCopyComp = RawCopy as Component

/**
 * CbCopy 包装组件
 * ------------------------------------------------------------
 * 设计原因：
 * 1. 组件库对外统一以 'CbCopy' 名称全局注册（resolver 匹配名 / install 注册名一致）。
 * 2. Copy.vue 模板内使用 <cb-icon>（kebab-case），Vue 编译为 resolveComponent('CbIcon')。
 *    在按需加载场景下若未全局注册 CbIcon 会渲染失败，因此在包装层幂等注入
 *    CbIcon 到 appContext.components（仅首次执行，重复注入安全）。
 *
 * Props：与 Copy.vue 内部 defineProps 保持一致，此处显式声明以保证 HOC setup
 * 内类型安全（SFC 编译对象的 .props 仅保留运行时校验，无法正确导出 TS 类型）。
 */
const Copy = defineComponent({
  name: 'CbCopy',
  // 禁用自动 attrs 透传：在 h() 中手动合并 props + attrs，避免重复
  inheritAttrs: false,
  props: {
    /** 要复制的文本内容（必填） */
    copyText: {
      type: String,
      required: true,
    },
    /** 复制成功后的提示文案 */
    copySuccessText: {
      type: String,
      default: '复制成功',
    },
  },
  setup(props, { attrs, slots }) {
    // 注入 CbIcon 到全局组件上下文（按需加载场景也能保证 CbIcon 已注册）
    const vm = getCurrentInstance()
    if (vm) {
      const globals = vm.appContext.components
      if (!globals.CbIcon) {
        globals.CbIcon = IconComp
      }
    }

    // 合并 props + attrs 透传给 RawCopy
    return () => h(RawCopyComp, { ...props, ...attrs }, slots)
  },
})

export { Copy }
export type { CopyProps }
export default Copy
