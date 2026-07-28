<template>
  <div
    class="cb-card"
    :class="{
      'is-bordered': bordered,
      'is-shadow': shadow,
    }"
    @click="handleClick"
  >
    <div v-if="title || $slots.header" class="cb-card__header">
      <slot name="header">
        <span class="cb-card__title">{{ title }}</span>
      </slot>
    </div>
    <div class="cb-card__body">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CardProps, CardEmits } from './types'

const props = withDefaults(defineProps<CardProps>(), {
  bordered: true,
  shadow: false,
})

const emit = defineEmits<CardEmits>()

const handleClick = (event: MouseEvent) => {
  emit('click', event)
}
</script>

<style scoped lang="scss">
.cb-card {
  background-color: $cb-color-bg;
  border-radius: $cb-radius;
  overflow: hidden;

  &.is-bordered {
    border: 1px solid $cb-color-border;
  }

  &.is-shadow {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }

  &__header {
    padding: $cb-space-16;
    border-bottom: 1px solid $cb-color-border;
  }

  &__title {
    font-size: $cb-font-size-title;
    font-weight: 600;
    color: $cb-color-text;
  }

  &__body {
    padding: $cb-space-16;
  }
}
</style>