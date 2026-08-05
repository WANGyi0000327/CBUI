<template>
  <div
    class="cb-input"
    :class="[
      `cb-input--${size}`,
      {
        'is-disabled': disabled,
        'is-focused': isFocused,
      },
    ]"
  >
    <!-- 前置内容 -->
    <span v-if="$slots.prefix" class="cb-input__prefix">
      <slot name="prefix" />
    </span>

    <!-- 原生输入框 -->
    <input
      ref="inputRef"
      class="cb-input__inner"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :maxlength="maxlength"
      @input="handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
      @keydown="handleKeydown"
    />

    <!-- 清除按钮 -->
    <span
      v-if="clearable && modelValue && !disabled && !readonly"
      class="cb-input__clear"
      @click="handleClear"
    >
      <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
        <path
          d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"
        />
      </svg>
    </span>

    <!-- 后置内容 -->
    <span v-if="$slots.suffix" class="cb-input__suffix">
      <slot name="suffix" />
    </span>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'CbInput' })

import { ref } from 'vue'
import type { InputProps, InputEmits } from './types'

withDefaults(defineProps<InputProps>(), {
  modelValue: '',
  size: 'medium',
  disabled: false,
  readonly: false,
  clearable: false,
  type: 'text',
})

const emit = defineEmits<InputEmits>()

const inputRef = ref<HTMLInputElement | null>(null)
const isFocused = ref(false)

// 输入处理
const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = target.value
  emit('update:modelValue', value)
  emit('input', value)
}

// 聚焦处理
const handleFocus = (event: FocusEvent) => {
  isFocused.value = true
  emit('focus', event)
}

// 失焦处理
const handleBlur = (event: FocusEvent) => {
  isFocused.value = false
  emit('blur', event)
}

// 键盘处理
const handleKeydown = (event: KeyboardEvent) => {
  emit('keydown', event)
}

// 清除处理
const handleClear = () => {
  emit('update:modelValue', '')
  emit('clear')
  inputRef.value?.focus()
}

// 暴露 focus 方法给父组件
defineExpose({
  focus: () => inputRef.value?.focus(),
  blur: () => inputRef.value?.blur(),
})
</script>

<style scoped lang="scss">
.cb-input {
  display: inline-flex;
  align-items: center;
  width: 100%;
  padding: 0 $cb-space-12;
  border: 1px solid $cb-color-border;
  border-radius: $cb-radius;
  background-color: $cb-color-bg;
  transition: all $cb-transition-duration $cb-transition-timing;

  // 聚焦状态
  &.is-focused {
    border-color: $cb-color-primary;
    box-shadow: 0 0 0 2px rgba($cb-color-primary, 0.15);
  }

  // 禁用状态
  &.is-disabled {
    background-color: $cb-color-bg-muted;
    cursor: not-allowed;

    .cb-input__inner {
      cursor: not-allowed;
      color: $cb-color-text-disabled;
    }
  }

  // ---- 尺寸 ----
  &--small {
    height: 28px;
    font-size: $cb-font-size-caption;
  }

  &--medium {
    height: 36px;
    font-size: $cb-font-size-body;
  }

  &--large {
    height: 44px;
    font-size: $cb-font-size-title;
  }

  // ---- 原生输入框 ----
  &__inner {
    flex: 1;
    width: 100%;
    height: 100%;
    border: none;
    outline: none;
    background: transparent;
    color: $cb-color-text;
    font-family: $cb-font-sans;
    font-size: inherit;

    &::placeholder {
      color: $cb-color-text-disabled;
    }
  }

  // ---- 前后置内容 ----
  &__prefix,
  &__suffix {
    display: inline-flex;
    align-items: center;
    color: $cb-color-text-muted;
  }

  &__prefix {
    margin-right: $cb-space-8;
  }

  &__suffix {
    margin-left: $cb-space-8;
  }

  // ---- 清除按钮 ----
  &__clear {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-left: $cb-space-8;
    color: $cb-color-text-muted;
    cursor: pointer;
    transition: color $cb-transition-duration $cb-transition-timing;

    &:hover {
      color: $cb-color-text;
    }
  }
}
</style>
