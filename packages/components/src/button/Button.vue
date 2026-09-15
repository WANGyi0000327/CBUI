<template>
  <TButton
    v-bind="$attrs"
    :type="nativeType"
    :theme="changeTheme"
    :class="effectiveTheme"
    :icon="renderIcon"
  >
    <!--
      传递具名插槽：用 Object.entries 后索引访问（slotEntry[0] = 插槽名），
      避免 `v-for="(_, name) in $slots"` 解构写法在 noImplicitAny 下的
      TS7022 "'name' implicitly has type any"：变量 name 同时在 `#[name]` 中
      被引用，造成自引用初始化器导致推断失败。
      `slotProps` 作为透传参数，运行时是任意对象，这里不做强类型是合理的。
    -->
    <template
      v-for="slotEntry in Object.entries($slots)"
      :key="slotEntry[0]"
      #[slotEntry[0]]="slotProps"
    >
      <slot :name="slotEntry[0]" v-bind="slotProps"></slot>
    </template>
  </TButton>
</template>

<script setup lang="tsx">
import type { TNode } from 'tdesign-vue-next'
import { Button as TButton } from 'tdesign-vue-next'
import type { PropType } from 'vue'
import { computed, h } from 'vue'
import CbIcon from '../icon/Icon.vue'
type ThemeTypes = 'default' | 'primary' | 'danger' | 'warning' | 'success'

type CustomThemeTypes = ThemeTypes | 'cb-brand-default' | 'cb-brand-gray'

type NativeButtonType = 'button' | 'submit' | 'reset'

defineOptions({
  name: 'TButton',
})

const themeTypes = ['default', 'primary', 'warning', 'success', 'danger']
const nativeTypes: NativeButtonType[] = ['button', 'submit', 'reset']
const props = defineProps({
  theme: {
    type: String as PropType<CustomThemeTypes>,
    default: 'primary',
  },
  icon: {
    type: [String, Function] as PropType<string | TNode>,
    default: undefined, // 加上这一行
  },
  /**
   * 兼容旧 API 的 type 双通道：
   * - 主题色值（primary/default/warning/success/danger/cb-brand-*）→ 自动映射为 theme，优先级高于 theme prop
   * - 原生按钮类型（button/submit/reset）→ 原样透传给 <t-button> 作为表单原生行为
   */
  type: {
    type: String as PropType<string>,
    default: undefined,
  },
})

const isThemeValue = (v: string) => themeTypes.includes(v) || v.startsWith('cb-brand-')

// 最终生效主题：type 写主题色时 type 优先，否则用 theme
const effectiveTheme = computed<CustomThemeTypes>(() => {
  const t = props.type
  if (t && isThemeValue(t)) return t as CustomThemeTypes
  return props.theme
})

// 原生按钮类型：type 为 button/submit/reset 时透传给 TButton 的 type prop
const nativeType = computed<NativeButtonType | undefined>(() => {
  const t = props.type
  if (t && nativeTypes.includes(t as NativeButtonType)) return t as NativeButtonType
  return undefined
})

const renderIcon = computed(() => {
  if (typeof props.icon === 'string') {
    return () => h(CbIcon, { name: String(props.icon) })
  }
  return props.icon
})

const changeTheme = computed(() =>
  themeTypes.findIndex((item) => item === effectiveTheme.value) === -1
    ? 'default'
    : (effectiveTheme.value as ThemeTypes)
)
</script>

<style lang="scss" scoped>
.t-button {
  padding: 6px 8px;
  min-width: 70px;
  // display: flex;
  gap: 4px;
  align-items: center;
  &.cb-brand-default {
    color: var(--td-brand-color);
    background-color: var(--td-brand-color-10);
    &.t-is-disabled {
      color: var(--td-text-color-9);
      background-color: #efefef;
    }
  }
  &.cb-brand-gray {
    color: var(--td-text-color-6);
    background-color: var(--td-brand-color-10);
    &.t-is-disabled {
      color: var(--td-text-color-9);
      background-color: #efefef;
    }
  }
  &.cb-brand-error {
    color: var(--td-error-color);
    background-color: var(--td-brand-color-10);
    &.t-is-disabled {
      color: var(--td-text-color-9);
      background-color: #efefef;
    }
  }
  &.t-button--variant-text {
    padding: 0 4px !important;
    min-width: 0px;
  }
}
</style>
