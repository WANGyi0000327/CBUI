<template>
  <div class="cb-cbname">
    <slot />
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'CbCbname' })

import type { CbnameProps } from './types'

withDefaults(defineProps<CbnameProps>(), {})
</script>

<style scoped lang="scss">
@use "@cb-ui/theme/src/variables" as *;

.cb-cbname {
  // 组件样式
}
</style>
