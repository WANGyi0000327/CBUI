<template>
  <div class="cb-date-picker">
    <slot />
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'CbDatePicker' })

import type { DatePickerProps } from './types'

withDefaults(defineProps<DatePickerProps>(), {})
</script>

<style scoped lang="scss">
@use "@cb-ui/theme/src/variables" as *;

.cb-date-picker {
  // 组件样式
}
</style>
