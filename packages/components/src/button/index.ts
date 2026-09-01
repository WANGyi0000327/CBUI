import { defineComponent, getCurrentInstance, h, type Component, type PropType } from 'vue'
import type { TNode } from 'tdesign-vue-next'
import RawButton from './Button.vue'
import Icon from '../icon'
import type {
  ButtonProps,
  ButtonEmits,
  ButtonSlots,
  ButtonType,
  ButtonSize,
  ButtonNativeType,
} from './types'

/**
 * 合法的 TDesign 原生按钮 theme（changeTheme 内部白名单一致）
 */
const THEME_WHITELIST = [
  'default',
  'primary',
  'warning',
  'success',
  'danger',
  'cb-brand-default',
  'cb-brand-gray',
] as const
/**
 * HTML <button> 原生 type 白名单（TDesign t-button 的 type prop 也只接受这三个）
 * 传入这些值时不做兼容转换，直接透传
 */
// const NATIVE_TYPE_WHITELIST = ['button', 'submit', 'reset'] as const

/**
 * 把 Vue SFC 组件 / 强类型 DefineComponent 放宽成通用 Component 类型。
 * 直接 `as DefineComponent` 会因泛型参数不匹配触发 TS2352：
 *   "Conversion of type 'DefineComponent<IconProps, ...>' to type 'DefineComponent'
 *    may be a mistake because neither type sufficiently overlaps with the other."
 * 用 `as Component`（h() 和 app.component() 都接受的联合类型）更宽松且语义正确。
 */
const IconComp = Icon as Component
const RawButtonComp = RawButton as Component

/**
 * TButton 包装组件
 * ------------------------------------------------------------
 * 设计原因：
 * 1. Button.vue 内部 defineOptions name = 'TButton'，不能改原文件
 *    但组件库需要对外暴露名为 'TButton' 的组件（用于全局注册 / resolver 匹配）
 * 2. Button.vue 内部 renderIcon 使用 JSX 语法 <cb-icon name={...} />
 *    JSX 运行时中字符串 "cb-icon" 作为标签走原生元素路径，不走 resolveComponent
 *    因此在包装层自动注入 CbIcon 到全局（幂等，仅首次执行），并把 icon 字符串转 h() 调用
 * 3. type → theme 兼容（文档"兼容旧写法"章节）：
 *    TDesign t-button 的 `type` 只能接受 submit/button/reset（HTML 原生 button type）
 *    把"旧主题色风格的 type"映射为 theme，并从 attrs 中移除，避免 TDesign 的 validator 告警
 *    优先级：type（主题色风格）> theme（与文档描述一致）
 *
 * Props 说明：此处显式重写一份与 Button.vue 内 defineProps 一致的声明，
 * 原因是 SFC 编译对象上的 `.props` 仅保留运行时校验配置、无法正确导出 TS 类型，
 * 若直接 `props: (RawButton as DefineComponent).props` 会导致 setup(props) 中
 * props.theme / props.icon 出现 TS2339 "Property does not exist" 标红。
 */
const Button = defineComponent({
  name: 'TButton',
  // 禁用自动 attrs 透传：我们在 h() 中手动合并 props + attrs，避免重复
  inheritAttrs: false,
  props: {
    /** 与 Button.vue 内部 defineProps 完全一致：主题（内置 5 色 + CB UI 2 种轻量主题） */
    theme: {
      type: String as PropType<NonNullable<ButtonProps['theme']>>,
      default: 'primary',
    },
    /** 与 Button.vue 内部 defineProps 完全一致：字符串 = CbIcon 名称；TNode = 自定义渲染 */
    icon: {
      type: [String, Function] as PropType<ButtonProps['icon']>,
      default: undefined,
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

    // setup 返回渲染函数：响应式读取 props/attrs
    return () => {
      const attrsObj = { ...attrs } as Record<string, unknown>
      let effectiveTheme: NonNullable<ButtonProps['theme']> = props.theme ?? 'primary'

      // ---------------- 1. type → theme 兼容处理 ----------------
      const typeVal = attrsObj.type
      if (typeof typeVal === 'string') {
        if ((THEME_WHITELIST as readonly string[]).includes(typeVal)) {
          // type 值是主题色 → 当作旧 API，映射为 theme（优先级更高），并删除 attrs 中的 type
          effectiveTheme = typeVal as NonNullable<ButtonProps['theme']>
          delete attrsObj.type
        }
        // NATIVE_TYPE_WHITELIST（submit/button/reset）→ 不处理，原样透传给 t-button 作为原生 type
      }

      // ---------------- 2. icon 字符串 → h(CbIcon, { name }) 包装 ----------------
      // 提前把字符串 icon 转成 "TNode 渲染函数"，绕开 Button.vue 内部 JSX 字符串标签路径
      const incomingIcon: ButtonProps['icon'] =
        attrsObj.icon !== undefined ? (attrsObj.icon as ButtonProps['icon']) : props.icon
      let effectiveIcon: ButtonProps['icon'] = incomingIcon
      if (typeof incomingIcon === 'string') {
        const iconName = incomingIcon
        effectiveIcon = (() => h(IconComp, { name: iconName })) as TNode
      }
      attrsObj.icon = effectiveIcon

      // 合并传给 RawButton：显式 theme 覆盖 props.theme，其余 props + attrs 原样透传
      const rawProps = {
        ...props,
        ...attrsObj,
        theme: effectiveTheme,
      }
      return h(RawButtonComp, rawProps, slots)
    }
  },
})

export { Button }
export type { ButtonProps, ButtonEmits, ButtonSlots, ButtonType, ButtonSize, ButtonNativeType }
export default Button
