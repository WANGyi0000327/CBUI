<template>
  <div class="cb-overflow-input">
    <div class="cb-overflow-input__content" :title="label">{{ label }}</div>
    <div v-if="count > 0" class="cb-overflow-input__unit">
      等{{ count }}{{ unit }}
    </div>
  </div>
</template>
<script setup lang="ts">
defineOptions({
  name: 'CbOverflowInput',
})
import { computed, type PropType } from 'vue'
const props = defineProps({
  max: {
    type: Number,
    default: 5,
  },
  data: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
  unit: {
    type: String,
  },
  delimiter: {
    type: String,
    default: '/',
  },
})
const label = computed(() => {
  const list = props.data.slice(0, props.max) || []
  return list?.join(props.delimiter)
})
const count = computed(() => props.data.length - props.max)
</script>
<style lang="scss">
.cb-overflow-input {
  color: var(--td-text-color-disabled);
  background-color: var(--td-bg-color-component-disabled);
  position: relative;
  height: var(--td-comp-size-m);
  border-width: 1px;
  border-style: solid;
  border-radius: var(--td-radius-default);
  border-color: var(--td-border-level-2-color);
  padding: 0 var(--td-comp-paddingLR-s);
  color: var(--td-text-color-9);
  width: 100%;
  transition:
    border cubic-bezier(0.38, 0, 0.24, 1) 0.2s,
    box-shadow cubic-bezier(0.38, 0, 0.24, 1) 0.2s,
    background-color cubic-bezier(0.38, 0, 0.24, 1) 0.2s;
  display: flex;
  align-items: center;
  .cb-overflow-input__content {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .cb-overflow-input__unit {
    flex-shrink: 0;
  }
}
</style>
