<template>
  <t-input-number
    v-model="modelValue"
    :placeholder="placeholder"
    theme="normal"
    :decimalPlaces="decimalPlaces"
    :max="max"
    :min="min"
    v-bind="$attrs"
    @blur="handleOnBlur"
    class="cb-currency-input"
    ref="currecyRef"
  >
    <template v-if="isShowSuffix" #suffix><span>元</span></template>
  </t-input-number>
</template>

<script lang="ts" setup>
import { MessagePlugin } from 'tdesign-vue-next'
import { ref } from 'vue'

defineOptions({
  name: 'CbCurrencyInput',
})

const props = defineProps({
  decimalPlaces: {
    type: Number,
    default: 2,
  },
  max: {
    type: Number,
    default: 9999999.99,
  },
  min: {
    type: Number,
    default: 0,
  },
  text: {
    type: String,
    default: '价格',
  },
  allowInputZero: {
    type: Boolean,
    default: true,
  },
  inputZeroMessage: {
    type: String,
    default: '不能输入0',
  },
  placeholder: {
    type: String,
    default: '请输入价格',
  },
  ishint: {
    type: Boolean,
    default: true,
  },
  isassignment: {
    type: Boolean,
    default: true,
  },
  // 是否需要显示元符号
  isShowSuffix: {
    type: Boolean,
    default: true,
  },
})

const currecyRef = ref()

const modelValue = defineModel<number | null>()

const handleOnBlur = (value: number) => {
  if (!props.allowInputZero && value === 0) {
    MessagePlugin.warning(props.inputZeroMessage)
    modelValue.value = null
    return
  }

  if (value > props.max) {
    if (props.ishint) {
      MessagePlugin.warning(`请输入${props.max}以内的数字`)
    }

    if (props.isassignment) {
      modelValue.value = props.max || null
    }
    return
  }

  if (value < props.min) {
    MessagePlugin.warning(`${props?.text}不能小于${props.min}`)
    modelValue.value = null
    return
  }
}

const focus = async () => {
  currecyRef.value?.focus()
}

defineExpose({ focus })
</script>

<style lang="scss" scoped>
.cb-currency-input {
  :deep(.t-input) {
    padding-right: 0px;
    outline: none;

    .t-input__suffix {
      width: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: var(--td-bg-color-1);
      border-left: 1px solid var(--td-border-color-1);
    }
  }
}
</style>
