<template>
  <cb-icon class="copy-icon" name="fuzhi" @click="handleCopy" />
</template>

<script setup lang="ts">
import { MessagePlugin } from 'tdesign-vue-next'

defineOptions({
  name: 'CbCopy',
})

interface Props {
  copyText: string
  copySuccessText?: string
}

const props = withDefaults(defineProps<Props>(), {
  copySuccessText: '复制成功',
})

const CopyText = async (text: string) => {
  if (navigator.clipboard) {
    await navigator.clipboard.writeText(text)
  } else {
    const el = document.createElement('input')
    el.setAttribute('value', text)
    document.body.appendChild(el)
    el.select()
    document.execCommand('copy')
    document.body.removeChild(el)
  }
  console.log(props, 'props.copySuccessText')
  MessagePlugin.success(props.copySuccessText, 1000)
}

const handleCopy = () => {
  if (props.copyText) {
    CopyText(props.copyText)
  }
}
</script>

<style lang="scss" scoped>
.copy-icon {
  cursor: pointer;
  &:hover {
    color: var(--td-brand-color);
  }
}
</style>
