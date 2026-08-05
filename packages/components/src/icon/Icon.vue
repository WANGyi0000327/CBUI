<template>
  <svg
    v-bind="$attrs"
    aria-hidden="true"
    class="svg-icon"
    :style="{ color, fontSize: size }"
  >
    <use :xlink:href="iconClassName" />
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { IconProps } from './types'

defineOptions({ name: 'CbIcon' })

const props = defineProps<IconProps>()

// 图标在 iconfont 中的名字
const iconClassName = computed(() => `#icon-${props.name}`)
</script>

<style scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  position: relative;
  fill: currentColor;
  vertical-align: -2px;
  display: inline-block;
}
</style>
