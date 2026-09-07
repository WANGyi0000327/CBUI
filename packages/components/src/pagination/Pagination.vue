<template>
  <t-pagination
    v-if="total > 0"
    show-sizer
    :page-size-options="pageSizeOptions"
    v-bind="$attrs"
    :total="total"
    :max-page-btn="7"
    show-jumper
  >
  </t-pagination>
</template>
<script lang="ts" setup>
defineOptions({
  name: 'CbPagination',
})
withDefaults(
  defineProps<{
    pageSizeOptions?: Array<{ label: string; value: number }>
    total: number
  }>(),
  {
    pageSizeOptions: () => {
      return [
        { label: '30 条/页', value: 30 },
        { label: '50 条/页', value: 50 },
        { label: '100 条/页', value: 100 },
      ]
    },
  }
)
</script>
<style scoped lang="scss">
.total-content {
  margin-right: 8px;
}
</style>
