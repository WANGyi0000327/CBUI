<template>
  <button
    class="cb-button"
    :class="[
      `cb-button--${type}`,
      `cb-button--${size}`,
      {
        'is-disabled': disabled || loading,
        'is-loading': loading,
        'is-block': block,
      },
    ]"
    :type="nativeType"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <!-- 加载图标 -->
    <span v-if="loading" class="cb-button__spinner" aria-hidden="true" />

    <!-- 按钮内容 -->
    <span class="cb-button__content">
      <slot />
    </span>
  </button>
</template>

<script setup lang="ts">
// withDefaults 和 defineEmits 是 Vue 编译器宏，无需显式导入
import type { ButtonProps, ButtonEmits } from './types'

// 使用 withDefaults 提供默认值，保持类型推导
// 注意：withDefaults 的默认值必须是字面量，不可引用 setup 内局部变量
const props = withDefaults(defineProps<ButtonProps>(), {
  type: 'default',
  size: 'medium',
  disabled: false,
  loading: false,
  nativeType: 'button',
  block: false,
})

const emit = defineEmits<ButtonEmits>()

// 点击处理：禁用或加载中时不触发
const handleClick = (event: MouseEvent) => {
  if (props.disabled || props.loading) return
  emit('click', event)
}
</script>

<style scoped lang="scss">
.cb-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: $cb-space-8;
  padding: $cb-space-8 $cb-space-16;
  border: 1px solid $cb-color-border;
  border-radius: $cb-radius;
  background-color: $cb-color-bg;
  color: $cb-color-text;
  font-family: $cb-font-sans;
  font-size: $cb-font-size-body;
  line-height: 1.5;
  cursor: pointer;
  transition: all $cb-transition-duration $cb-transition-timing;
  user-select: none;
  white-space: nowrap;

  // 块级按钮
  &.is-block {
    display: flex;
    width: 100%;
  }

  // ---- 类型变体 ----
  &--primary {
    background-color: $cb-color-primary;
    border-color: $cb-color-primary;
    color: #fff;

    &:hover:not(.is-disabled) {
      background-color: $cb-color-primary-dark;
      border-color: $cb-color-primary-dark;
    }
  }

  &--default {
    background-color: $cb-color-bg;
    border-color: $cb-color-border;
    color: $cb-color-text;

    &:hover:not(.is-disabled) {
      border-color: $cb-color-primary;
      color: $cb-color-primary;
    }
  }

  &--danger {
    background-color: $cb-color-danger;
    border-color: $cb-color-danger;
    color: #fff;

    &:hover:not(.is-disabled) {
      opacity: 0.9;
    }
  }

  // ---- 尺寸变体 ----
  &--small {
    padding: $cb-space-4 $cb-space-12;
    font-size: $cb-font-size-caption;
  }

  &--large {
    padding: $cb-space-12 $cb-space-24;
    font-size: $cb-font-size-title;
  }

  // ---- 状态 ----
  &.is-disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  // ---- 加载图标 ----
  &__spinner {
    display: inline-block;
    width: 14px;
    height: 14px;
    border: 2px solid currentColor;
    border-top-color: transparent;
    border-radius: 50%;
    animation: cb-button-spin 0.6s linear infinite;
  }
}

@keyframes cb-button-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
