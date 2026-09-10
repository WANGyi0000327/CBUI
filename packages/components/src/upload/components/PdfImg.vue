<template>
  <div class="custom-image">
    <img :src="pdfImg" alt="" />
  </div>
</template>
<script lang="ts" setup>
import pdfImg from '../../../assets/images/pdfImg.png'
defineOptions({
  name: 'CbPdfImg',
})
</script>
<style lang="scss" scoped>
.custom-image {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--td-text-color-6);
  font-size: 16px;
}
</style>
