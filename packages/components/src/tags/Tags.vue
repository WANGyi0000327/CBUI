<template>
  <div class="cb-tags">
    <template v-for="item in values?.slice(0, max)" :key="item">
      <t-tag>{{ item }}</t-tag>
    </template>
    <t-tag v-if="foldLength > 0">+{{ foldLength }}</t-tag>
  </div>
</template>
<script lang="ts" setup>
import type { PropType } from 'vue'
import { computed } from 'vue'
const props = defineProps({
  values: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
  max: {
    type: Number,
    default: Infinity,
  },
})
const foldLength = computed(() => props.values?.slice(props.max).length)
defineOptions({
  name: 'CbTags',
})
</script>
<style lang="scss" scoped>
.cb-tags {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
  :deep(.t-tag) {
    padding: 4px 8px;
    background-color: var(--td-color-gary-ecf6);
  }
}
</style>
