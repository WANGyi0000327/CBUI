<template>
  <div class="cb-good-main-image" :style="wrapperStyle">
    <t-image :src="src" fit="cover" position="center" :style="imageStyle">
      <template #error>
        <div class="fallback-wrapper">
          <div class="fallback-text">
            {{ displayName }}
          </div>
        </div>
      </template>
      <template #loading>
        <div class="fallback-wrapper">
          <t-loading size="small" />
        </div>
      </template>
    </t-image>
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue'
defineOptions({
  name: 'CbGoodMainImage',
})
interface Props {
  src?: string
  name?: string
  width?: string | number
  height?: string | number
}
const props = withDefaults(defineProps<Props>(), {
  src: '',
  name: '',
  width: '100%',
  height: '100%',
})
const displayName = computed(() => {
  return props.name?.slice(0, 20) || ''
})
const formatSize = (size: string | number) => {
  return typeof size === 'number' ? `${size}px` : size
}
const imageStyle = computed(() => ({
  width: formatSize(props.width),
  height: formatSize(props.height),
  borderRadius: '2px',
}))
const wrapperStyle = computed(() => {
  return {
    width: formatSize(props.width),
    height: formatSize(props.height),
    borderRadius: '2px',
  }
})
</script>
<style lang="scss" scoped>
.cb-good-main-image {
  display: inline-block;
  vertical-align: middle;
  overflow: hidden;
  /* 声明为容器，允许子元素根据其实际宽度计算大小 */
  container-type: inline-size;
  :deep(.t-image) {
    background-color: #f3f3f3;
    border-radius: inherit;
  }
  .fallback-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: url(./default.png) no-repeat center;
    background-size: 100% 100%;
    padding: 4%; // 左右各 4%
    box-sizing: border-box;
    .fallback-text {
      color: #fff;
      text-align: center;
      font-weight: bold;
      word-break: break-all;
      /**
       * 字体大小核心计算：
       * 1. 容器总宽度为 100cqw
       * 2. 左右 padding 各 4%，可用宽度 = 92cqw
       * 3. 每排显示 10 个字，字号 = 92cqw / 10 = 9.2cqw
       */
      font-size: 9.2cqw;
      line-height: 1.2;
      /* 2.4em 确保正好两行高度 */
      height: 2.4em;
      width: 100%;
      display: block;
      overflow: hidden;
      white-space: normal;
      text-overflow: clip;
    }
  }
}
</style>
