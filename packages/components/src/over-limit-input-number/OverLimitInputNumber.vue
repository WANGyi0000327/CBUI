<template>
  <t-input-number
    v-model="modelValue"
    v-bind="$attrs"
    :max="max"
    :min="min"
    :allow-input-over-limit="allowInputOverLimit"
    @change="(value: InputNumberValue, context: ChangeContext) => handleChange(value, context)"
  >
    <!-- 传递具名插槽 -->
    <template v-for="slotEntry in slotEntries" #[slotEntry[0]]="slotProps">
      <slot :name="slotEntry[0]" v-bind="slotProps"></slot>
    </template>
  </t-input-number>
</template>
<script lang="ts" setup>
import type { InputNumberValue, ChangeContext } from 'tdesign-vue-next'
import { nextTick, ref, useSlots, type Slot } from 'vue'
defineOptions({
  name: 'CbOverLimitInputNumber',
})
const slotEntries = Object.entries(useSlots()) as [string, Slot][]
const props = defineProps({
  enableTruncation: {
    type: Boolean,
    default: false,
  },
  allowInputOverLimit: {
    type: Boolean,
    default: true,
  },
  max: {
    type: Number,
    default: Infinity,
  },
  min: {
    type: Number,
    default: -Infinity,
  },
})
const modelValue = defineModel<number | string>('modelValue', {
  default: '',
  get: (value) => value,
  set: (value) => {
    // 当输入为空字符串时，保持为空，不回填最小值
    if (value === '') {
      return ''
    }
    return value
  },
})
const emit = defineEmits(['change'])
// 缓存上一次有效值，用于 allowInputOverLimit 为 false 时回滚
const lastValidValue = ref<InputNumberValue>(modelValue.value)
const handleChange = (value: InputNumberValue, context: ChangeContext) => {
  // 如果值是数字且不允许输入超出限制的值
  if (!props.allowInputOverLimit && typeof value === 'number') {
    const min = props.min
    const max = props.max
    const isOverflow =
      (min !== undefined && min !== -Infinity && value < min) ||
      (max !== undefined && max !== Infinity && value > max)
    if (isOverflow) {
      // 恢复为上一次有效值，阻止本次输入生效
      nextTick(() => {
        modelValue.value = lastValidValue.value
      })
      return
    }
  }
  if (props.enableTruncation) {
    if (typeof value === 'string') return
    const min = props.min
    const max = props.max
    let truncatedValue = value
    // min 值不能大于 0 大于等于0时 不开启截断 因为会导致输入框不能输入部分数字
    // 计算截断后的值
    if (min !== undefined && min !== -Infinity && min <= 0 && (truncatedValue as number) <= min) {
      truncatedValue = min
    } else if (max !== undefined && max !== Infinity && (truncatedValue as number) > max) {
      truncatedValue = max
    }
    // 发出change事件
    emit('change', truncatedValue, context)
    // 使用nextTick直接截断输入值
    if (truncatedValue !== value) {
      nextTick(() => {
        modelValue.value = truncatedValue
      })
    }
    lastValidValue.value = truncatedValue
    return
  }
  // 正常情况：更新有效值缓存并抛出事件
  if (value === '' || typeof value === 'number') {
    lastValidValue.value = value
  }
  emit('change', value, context)
}
</script>
