/**
 * ButtonFold 折叠按钮组件入口（HOC 包装层）
 * ----------------------------------------------------------------
 * - name: 'CbButtonFold'（对全局注册名，符合 Cb 前缀约定）
 * - 幂等注入 CbIcon 到全局组件上下文（保证按需加载时 <cb-icon> 可解析）
 * - 透传 props + attrs 给原始 ButtonFold.vue
 *
 * 原始 ButtonFold.vue 保持用户代码不动，所有"对外适配"在此层处理
 */
import {
  defineComponent,
  getCurrentInstance,
  h,
  type Component,
  type PropType,
} from 'vue'
import RawButtonFold from './ButtonFold.vue'
import Icon from '../icon'
import type { ButtonFoldProps, ButtonFoldType } from './types'

// SFC 组件对象 -> 通用 Component 类型（避开 SFC 强类型泛型与裸 DefineComponent 不重叠）
const IconComp = Icon as Component
const RawButtonFoldComp = RawButtonFold as Component

const ButtonFold = defineComponent({
  name: 'CbButtonFold',
  inheritAttrs: false,
  props: {
    /** 更多按钮文案（type='moreBtn' 时生效） */
    operationName: {
      type: String,
      default: '更多',
    },
    /** 直接展示的操作数量，超出部分折叠到弹出层 */
    expendNum: {
      type: Number,
      default: 1,
    },
    /** 是否禁用全部操作 */
    disabledAll: {
      type: Boolean,
      default: false,
    },
    /** 弹出层自定义 class */
    overlayClassName: {
      type: String,
      default: '',
    },
    /** 展示类型：icon=图标更多按钮，moreBtn=文字更多按钮 */
    type: {
      type: String as PropType<ButtonFoldType>,
      default: 'icon',
    },
  },
  setup(props, { attrs, slots }) {
    // 幂等注入 CbIcon 到全局组件上下文
    // 场景：按需加载只引入 CbButtonFold 时，CbIcon 未全局注册，模板里 <cb-icon> 会无法解析
    const vm = getCurrentInstance()
    if (vm) {
      const globals = vm.appContext.components
      if (!globals.CbIcon) {
        globals.CbIcon = IconComp
      }
    }

    return () => h(RawButtonFoldComp, { ...props, ...attrs }, slots)
  },
})

export { ButtonFold }
export type { ButtonFoldProps, ButtonFoldType }
export default ButtonFold
