<template>
  <t-input
    v-bind="$attrs"
    ref="inputRef"
    v-model.trim="modelValue"
    type="text"
    :style="{ width: searchwidth }"
    class="search-input"
    :clearable="false"
    :disabled="disabled"
    @enter="handleSearchClick"
  >
    <template #label>
      <cb-icon v-if="!modelValue" name="sousuo" />
    </template>
    <template #suffix>
      <div @click.stop="handleClear">
        <cb-icon v-if="modelValue && modelValue.length >= 1" name="cuowu" class="input-close" />
      </div>
      <!-- <t-loading size="small" showOverlay :loading="loading"> -->
      <div class="search-suffix" :class="{ disabled }" @click="handleSearchClick">
        <span>搜索</span>
      </div>
      <!-- </t-loading> -->
    </template>
  </t-input>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
const modelValue = defineModel<string>()
defineOptions({
  name: 'CbSearchInput',
})
defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  searchwidth: {
    type: String,
    default: '300px',
  },
})
const emits = defineEmits(['search'])
const handleSearchClick = () => {
  emits('search', modelValue.value)
}
const handleClear = () => {
  modelValue.value = undefined
  emits('search')
}
const inputRef = ref()
const handleFocus = () => {
  inputRef.value.focus()
}
defineExpose({
  handleFocus,
})
</script>
<style lang="scss" scoped>
.search-input {
  width: 300px;
  :deep(.t-input) {
    padding-right: 0;
    &.t-input--focused {
      .input-close {
        opacity: 1;
      }
    }
  }
  .input-close {
    opacity: 0;
    cursor: pointer;
    margin-right: 5px;
    position: relative;
    z-index: 99;
  }
  &:hover .input-close {
    opacity: 1;
  }
  .search-suffix {
    display: flex;
    padding: 6px 8px;
    justify-content: center;
    align-items: center;
    gap: 4px;
    border-radius: 0 2px 2px 0;
    background: var(--td-brand-color);
    color: #fff;
    cursor: pointer;
    &.disabled {
      background-color: var(--td-brand-color-6);
      cursor: not-allowed;
      pointer-events: none;
    }
  }
  :deep(.t-input__inner) {
    font-size: 12px;
  }
}
</style>
