<template>
  <div class="w-full h-full flex items-center justify-center">
    <div
      :style="`width:${screenWidth < 1880 ? 640 : 1280}px;height:${screenWidth < 1880 ? 360 : 720}px`"
    >
      <CbVideoPlayer :src="src"></CbVideoPlayer>
    </div>
  </div>
</template>
<script setup lang="ts">
// 业务源码 import CbVideoPlayer from '../../CbVideoPlayer/index.vue'，组件库内对应 video-player 目录
// 原源码含两段重复的 script setup（SFC 不合法），已合并为一段
import CbVideoPlayer from '../../video-player/index.vue'
// 屏幕宽度获取
import { useWindowSize } from '@vueuse/core'
defineOptions({
  name: 'CbVideo',
})
defineProps({
  src: {
    type: String,
    required: true,
  },
})
const { width: screenWidth } = useWindowSize()
</script>
<style scoped lang="scss"></style>
