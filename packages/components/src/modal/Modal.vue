<template>
  <div class="cb-modal">
    <slot />
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'CbModal' })

import type { ModalProps } from './types'

withDefaults(defineProps<ModalProps>(), {})
</script>

<style scoped lang="scss">
@use "@cb-ui/theme/src/variables" as *;

.cb-modal {
  // 组件样式
}
</style>
