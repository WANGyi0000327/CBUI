<template>
  <t-form
    v-if="visibleFields.length && formData"
    v-bind="$attrs"
    ref="formRef"
    :data="formData"
    reset-type="initial"
  >
    <t-form-item
      v-for="field in visibleFields"
      :key="field.key"
      :name="field.key"
      :label="renderLabel(field)"
      :rules="field.rules"
      :disabled="field.disabled"
    >
      <!-- 自定义内容渲染 -->
      <template v-if="typeof field.content === 'function'">
        <render-content v-model="formData[field.key]" :render="field.content" :field="field" />
      </template>
      <!-- 默认表单控件 -->
      <template v-else>
        <!-- 输入框 -->
        <t-input
          v-if="field.type === 'input' || !field.type"
          v-model="formData[field.key]"
          v-bind="field.props"
          clearable
        />
        <!-- 下拉选择 -->
        <t-select
          v-else-if="field.type === 'select'"
          v-model="formData[field.key]"
          v-bind="field.props"
          :options="field.options"
          clearable
        />
        <!-- 复选框组 -->
        <t-checkbox-group
          v-else-if="field.type === 'checkbox'"
          v-model="formData[field.key]"
          v-bind="field.props"
          :options="field.options"
        />
        <!-- 单选框组 -->
        <t-radio-group
          v-else-if="field.type === 'radio'"
          v-model="formData[field.key]"
          v-bind="field.props"
          :options="field.options"
        />
        <!-- 日期选择 -->
        <t-date-picker
          v-else-if="field.type === 'date'"
          v-model="formData[field.key]"
          v-bind="field.props"
          clearable
        />
        <!-- 范围日期选择 -->
        <t-date-range-picker
          v-else-if="field.type === 'dateRange'"
          v-model="formData[field.key]"
          v-bind="field.props"
          clearable
        />
      </template>
    </t-form-item>
    <slot name="submit"> </slot>
  </t-form>
</template>
<script setup lang="ts">
defineOptions({
  name: 'CbDynamicFormGenerator',
})
import { computed, ref, type PropType } from 'vue'
import type { FormField, FormValues } from './dynamicFormGenerator'
// 组件库内相对引用 RenderContent（业务中为 #/components/CbRenderComponent/index.vue）
import RenderContent from '../render-component/index'
const props = defineProps({
  fields: {
    type: Array as PropType<Array<FormField>>,
  },
})
// 表单数据
const formData = defineModel<FormValues>('formData', { required: true })
const formRef = ref()
// 可见字段（支持条件显示）
const visibleFields = computed(() => {
  return (
    props.fields?.filter((field) => {
      // 原源码为 formData.value?.hasOwnProperty(field.key)，触发 lint no-prototype-builtins，改为等价写法
      if (
        field.hidden ||
        !formData.value ||
        !Object.prototype.hasOwnProperty.call(formData.value, field.key)
      )
        return false
      if (field.showWhen) return field.showWhen()
      return true
    }) || []
  )
})
// 渲染 label
const renderLabel = (field: FormField) => {
  if (typeof field.label === 'function') {
    return {
      render: field.label,
    }
  }
  return field.label
}
const validate = async () => {
  const res = await formRef.value.validate()
  return res === true
}
const reset = () => {
  formRef.value.reset()
}
defineExpose({ validate, reset })
</script>
