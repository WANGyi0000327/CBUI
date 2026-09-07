import { defineComponent, h, type Component, type PropType } from 'vue'
import RawGridLayout from './GridLayout.vue'
import type { GridLayoutProps } from './types'

/**
 * 把 Vue SFC 组件放宽成通用 Component 类型（与 button/index.ts 一致）。
 * 直接 `as DefineComponent` 会因泛型参数不匹配触发 TS2352，用 `as Component` 更宽松。
 */
const RawGridLayoutComp = RawGridLayout as Component

/**
 * CbGridLayout 包装组件
 * ------------------------------------------------------------
 * 设计原因（与 button / copy HOC 统一结构）：
 * 1. 组件库对外统一以 'CbGridLayout' 名称全局注册（resolver 匹配名 / install 注册名一致）。
 *    GridLayout.vue 内部 defineOptions name 已是 'CbGridLayout'（符合 Cb 前缀约定），
 *    此处仍通过 HOC 封装，保持与 Button / Copy 一致的工程结构，避免后续新增 CbIcon 依赖时
 *    需从 CurrencyInput 风格（barrel export）重构回 HOC。
 * 2. 该组件未使用 <cb-icon>，无需注入 CbIcon。
 * 3. 组件内部通过 document.querySelector(props.cardContainer) 读取容器宽度，
 *    无需额外兼容处理，props + attrs 原样透传即可。
 *
 * Props：与 GridLayout.vue 内部 Props 接口保持一致，此处显式声明以保证
 * HOC setup 内类型安全（SFC 编译对象的 .props 仅保留运行时校验，无法导出 TS 类型）。
 */
const GridLayout = defineComponent({
  name: 'CbGridLayout',
  // 禁用自动 attrs 透传：在 h() 中手动合并 props + attrs，避免重复
  inheritAttrs: false,
  props: {
    /** 外层盒子的元素选择器 */
    cardContainer: {
      type: String as PropType<NonNullable<GridLayoutProps['cardContainer']>>,
      default: '',
    },
    /** 单个卡片最小宽度（px） */
    minCardWidth: {
      type: Number as PropType<NonNullable<GridLayoutProps['minCardWidth']>>,
      default: 375,
    },
    /** 卡片间距（px） */
    gap: {
      type: Number as PropType<NonNullable<GridLayoutProps['gap']>>,
      default: 8,
    },
    /** 最小列数 */
    minCol: {
      type: Number as PropType<NonNullable<GridLayoutProps['minCol']>>,
      default: 3,
    },
  },
  setup(props, { attrs, slots }) {
    // 合并 props + attrs 透传给 RawGridLayout（与 Copy/index.ts 一致）
    return () => h(RawGridLayoutComp, { ...props, ...attrs }, slots)
  },
})

export { GridLayout }
export type { GridLayoutProps }
export default GridLayout
