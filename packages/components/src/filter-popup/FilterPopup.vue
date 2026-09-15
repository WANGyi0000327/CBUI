<template>
  <t-popup
    v-model="visible"
    trigger="click"
    placement="bottom"
    :overlay-inner-style="{ transform: 'translateX(-20px)' }"
  >
    <template #content>
      <div v-if="currentFormData" class="filter-popup-content">
        <slot name="content">
          <cb-dynamic-form-generator
            ref="formRef"
            v-model:form-data="currentFormData"
            :fields="fields"
            label-align="top"
            reset-type="initial"
          />
        </slot>
        <div class="flex justify-end gap-[8px] mt-[20px]">
          <t-button theme="default" @click="handleReset">重置</t-button>
          <t-button theme="primary" @click="handleQuery">确定</t-button>
        </div>
      </div>
    </template>
    <t-button
      theme="default"
      :disabled="disabled"
      :loading="loading"
      :class="{ 'filter-active-button': !!filterLen }"
    >
      <div class="flex items-center gap-[5px]">
        <cb-icon name="shaixuan" />
        筛选{{ filterLen ? `(${filterLen})` : '' }}
        <cb-icon v-if="filterLen" name="guanbi" @click.stop="handleClear" />
      </div>
    </t-button>
  </t-popup>
</template>
<script lang="ts" setup>
defineOptions({
  name: 'CbFilterPopup',
})
import { ref, type PropType, computed, watch } from 'vue'
import CbDynamicFormGenerator from '#/dynamic-form-generator/DynamicFormGenerator.vue'
import type { FormField, FormValues } from '#/dynamic-form-generator/dynamicFormGenerator'
import { cloneDeep } from 'lodash'
const visible = ref(false)
const props = defineProps({
  fields: Array as PropType<Array<FormField>>,
  disabled: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})
const defaultValue = ref()
const filterLen = computed(() => {
  let count = 0
  props.fields?.forEach((item) => {
    const formValue = formData.value[item.key]
    const defaultValueValue = defaultValue.value[item.key]
    // 检查值是否与默认值不同，或者是有内容的数组
    if (Array.isArray(formValue) ? formValue.length > 0 : formValue !== defaultValueValue) {
      if (formValue !== null && formValue !== undefined) count++
    }
  })
  return count
})
const currentFormData = ref<FormValues>()
const formData = defineModel<FormValues>('formData', { required: true })
const handleReset = () => {
  formRef.value.reset()
  formData.value = cloneDeep(currentFormData.value) as FormValues
}
const formRef = ref()
const emits = defineEmits(['query'])
const handleQuery = () => {
  formData.value = cloneDeep(currentFormData.value) as FormValues
  emits('query')
  visible.value = false
}
const handleClear = () => {
  handleReset()
  emits('query')
}
watch(
  () => visible.value,
  () => {
    if (visible.value) {
      currentFormData.value = cloneDeep(formData.value)
    }
  }
)
watch(
  () => formData,
  () => {
    defaultValue.value = { ...formData.value }
  },
  { once: true, immediate: true }
)
</script>
<style lang="scss" scoped>
.filter-popup-content {
  padding: 20px;
  width: 360px;
}
.filter-active-button {
  border: var(--td-brand-color-10);
  background-color: var(--td-brand-color-10);
  color: var(--td-brand-color);
}
</style>
