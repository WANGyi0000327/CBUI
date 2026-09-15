<template>
  <t-input
    v-model="displayString"
    v-bind="$attrs"
    autocomplete="off"
    @input="onInput"
    @blur="onBlur"
    @change="onChange"
  />
</template>
<script setup lang="ts">
defineOptions({
  name: 'CbNumericInput',
})
import { ref, watch } from 'vue'
interface Props {
  decimalPlaces?: number
  max?: number
  min?: number
}
const props = withDefaults(defineProps<Props>(), {
  decimalPlaces: 2,
  max: Infinity,
  min: -Infinity,
})
const emits = defineEmits(['blur', 'change'])
const modelValue = defineModel<number | null | undefined>()
const displayString = ref<string>(modelValue.value?.toString() || '')
watch(
  () => modelValue.value,
  (newVal) => {
    if (newVal === null || newVal === undefined) {
      displayString.value = ''
      return
    }
    if (parseFloat(displayString.value) !== newVal) {
      displayString.value = newVal.toString()
    }
  },
  { immediate: true }
)
const onInput = (val: InputEvent | string) => {
  if (!val) return
  let s =
    typeof val === 'object' && val?.target
      ? (val.target as HTMLInputElement).value
      : val?.toString() || ''
  if (s.includes('-')) {
    s = (s.startsWith('-') ? '-' : '') + s.slice(1).replace(/-/g, '')
  }
  const parts = s.split('.')
  if (parts.length > 2) s = parts[0] + '.' + parts.slice(1).join('')
  if (s && s.includes('.') && props.decimalPlaces >= 0) {
    const [int = '', dec = ''] = s.split('.')
    s = props.decimalPlaces === 0 ? int : `${int}.${dec?.slice(0, props.decimalPlaces)}`
  }
  displayString.value = s
  const num = parseFloat(s)
  if (!isNaN(num) && s !== '-' && !s.endsWith('.')) {
    modelValue.value = num
  } else if (s === '') {
    modelValue.value = null
  }
}
const onChange = (val: number) => {
  emits('change', val)
}
const onBlur = () => {
  if (displayString.value === '' || displayString.value === '-') {
    displayString.value = ''
    modelValue.value = null
    return
  }
  let num = parseFloat(displayString.value)
  if (isNaN(num)) return
  if (num > props.max) num = props.max
  if (num < props.min) num = props.min
  const roundedNum = parseFloat(num.toFixed(props.decimalPlaces))
  displayString.value = roundedNum.toString()
  modelValue.value = roundedNum
  emits('blur')
}
</script>
