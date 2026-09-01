<template>
  <div
    id="CbDateRangeConfirmPicker"
    v-click-outside="handleClose"
  >
    <t-date-range-picker
      v-model="value"
      v-bind="$attrs"
      :presets="presets"
      :popup-props="popupProps"
      presetsPlacement="bottom"
      @click="handleOpen"
      class="cb-date-range-confirm-picker"
      @presetClick="handleConfirmClick"
    >
    </t-date-range-picker>
  </div>
</template>

<script lang="tsx" setup>
defineOptions({
  name: 'CbDateRangeConfirmPicker',
})

import { computed, ref } from 'vue'
const value = defineModel<string[]>()
const snapshotValue = ref<string[]>([]) // 用于存放打开时的备份

const emits = defineEmits(['change'])

const visible = ref(false)

const presets = computed(() => ({
  确定: value.value || [],
}))

const handleClose = () => {
  if (!visible.value) return
  visible.value = false
  value.value = [...snapshotValue.value]
}

function getAttach() {
  return document.querySelector('#CbDateRangeConfirmPicker')
}

const popupProps = computed(() => {
  return {
    visible: visible.value,
    overlayClassName: 'cb-date-range-confirm-popup',
    attach: getAttach,
  }
})

const handleOpen = () => {
  if (visible.value) return
  visible.value = true
  snapshotValue.value = value.value ? [...value.value] : []
}

const handleConfirmClick = () => {
  emits('change', value.value)
  if (value.value?.length) {
    visible.value = false
  }
}
</script>

<style lang="scss">
  .cb-date-range-confirm-popup {
    .t-date-picker__footer {
      justify-content: end;

      .t-button {
        background: var(--td-brand-color) !important;
        color: #fff !important;
      }
    }
  }
</style>
