<template>
  <div>
    <slot name="PageInfoMationFront"></slot>
    <t-pagination
      v-model="currentPage"
      v-model:page-size="pageSize"
      :total="total"
      show-jumper
      :page-size-options="pageSizeOptions"
      v-bind="$attrs"
      @change="onChange"
      @page-size-change="onPageSizeChange"
      @current-change="onCurrentChange"
    />
  </div>
</template>
<script lang="ts" setup>
defineOptions({
  name: 'CBPagination',
})
import { type PaginationProps } from 'tdesign-vue-next'
const currentPage = defineModel('currentPage', {
  type: Number,
  default: 1,
})
const pageSize = defineModel('pageSize', {
  type: Number,
  default: 30,
})
const pageSizeOptions = defineModel<PaginationProps['pageSizeOptions']>('pageSizeOptions', {
  type: Array as () => number[],
  default: () => [30, 50, 100],
})
// Props 默认值
withDefaults(
  defineProps<{
    total?: number
  }>(),
  {
    total: 0,
  }
)
const emit = defineEmits(['onPageSizeChange', 'onCurrentChange', 'onChange'])
const onPageSizeChange: PaginationProps['onPageSizeChange'] = (size) => {
  console.log('page-size:', size)
  //   MessagePlugin.success(`pageSize变化为${size}`);
  currentPage.value = 1
  emit('onPageSizeChange', size)
}
const onCurrentChange: PaginationProps['onCurrentChange'] = (index, pageInfo) => {
  //   MessagePlugin.success(`转到第${index}页`);
  //   console.log("🎉-----pageInfo-----", pageInfo);
  emit('onCurrentChange', index, pageInfo)
}
const onChange: PaginationProps['onChange'] = (pageInfo) => {
  emit('onChange', pageInfo)
}
</script>
