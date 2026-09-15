<template>
  <t-radio-group
    :value="typeid"
    variant="primary-filled"
    class="!mb-[16px] radiogroup"
    @change="tab_chk"
  >
    <t-radio-button v-for="item in type_tab" :key="item.id" :value="item.id"
      >{{ item.label }}
      <slot name="value" :item="item"> </slot>
    </t-radio-button>
  </t-radio-group>
</template>
<script lang="ts" setup>
import type { PropType } from 'vue'
const typeid = defineModel()
const emits = defineEmits(['tab_chk'])
const props = defineProps({
  type_tab: {
    type: Array as PropType<{ id: number; label: string; value: number }[]>,
    default: () => [],
  },
})
const tab_chk = (id: number | string) => {
  if (id === typeid.value) return
  typeid.value = id
  emits('tab_chk', id)
}
defineOptions({
  name: 'Cbtabs',
})
</script>
<style lang="scss" scoped>
.radiogroup {
  :deep(.t-radio-button) {
    height: 32px;
  }
}
</style>
