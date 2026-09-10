<template>
<div class="w-full h-full flex items-center justify-center">
   <div :style="`width:${screenWidth<1880?640:1280}px;`" class="audio">
  <CbAudioPlayer  :src="src"></CbAudioPlayer>
   </div>
</div>
</template>
<script setup lang="ts">
// 业务源码 import CbAudioPlayer from '../../CbAudioPlayer/index.vue'，组件库内对应 audio-player 目录
import CbAudioPlayer from '../../audio-player/index.vue'
import { useWindowSize } from '@vueuse/core'
defineOptions({
  name: 'CbAudio',
})
defineProps({
  src: {
    type: String,
    required: true,
  },
})
// 屏幕宽度获取
const { width: screenWidth } = useWindowSize()
</script>
<style scoped lang="scss">
.audio{
  height: 56px;
  background: #FFFFFF;
  border-radius: 56px;
  padding:0 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.1));
}
</style>
