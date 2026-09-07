<template>
  <div>
    <t-input-adornment :style="{ width: props.inputWidth }">
      <t-input v-model="keywords" :placeholder="placeholder" :clearable="clearable" />
      <template #append>
        <t-button variant="outline" class="!bg-[#CCA47A] !text-[#FFFFFF]" @click="handleClick">
          <template #icon>
            <div class="w-[14px] h-[14px] flex items-center">
              <cb-icon name="sousuo" color="#fff"></cb-icon>
            </div>
          </template>
          <span class="ml-[8px]">搜索</span>
        </t-button>
      </template>
    </t-input-adornment>
  </div>
</template>
<script lang="tsx">
export default { name: 'CBSearch' }
</script>
<script setup lang="tsx">
defineOptions({
  name: 'CBSearch',
})
const props = withDefaults(
  defineProps<{
    inputWidth?: string
    placeholder?: string
    clearable?: boolean
  }>(),
  {
    inputWidth: '300px',
    placeholder: '请输入内容',
    clearable: true,
  }
)
const emit = defineEmits(['search'])
// 使用正确的defineModel语法，直接使用默认的v-model绑定
const keywords = defineModel({
  type: String,
  default: '',
})
const handleClick = () => {
  emit('search', keywords.value)
}
</script>
<style lang="scss" scoped></style>
