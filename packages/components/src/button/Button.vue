<template>
  <TButton v-bind="$attrs" :theme="changeTheme" :class="theme" :icon="renderIcon">
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

defineOptions({
  name: 'TButton',
})

const themeTypes = ['default', 'primary', 'warning', 'success', 'danger']
const props = defineProps({
  theme: {
    type: String as PropType<CustomThemeTypes>,
    default: 'primary',
  },
  icon: {
    type: [String, Function] as PropType<string | TNode>,
    default: undefined, // 加上这一行
  },
})

const renderIcon = computed(() => {
  if (typeof props.icon === 'string') {
    return () => h(CbIcon, { name: String(props.icon) })
  }
  return props.icon
})

const changeTheme = computed(() =>
  themeTypes.findIndex((item) => item === props.theme) === -1
    ? 'default'
    : (props.theme as ThemeTypes)
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
