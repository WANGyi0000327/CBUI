<template>
  <div class="cb-video-player">
    <video
      ref="videoRef"
      :src="src"
      :poster="poster"
      @timeupdate="onTimeUpdate"
      @loadedmetadata="onLoadedMetadata"
      @ended="onEnded"
      @play="isPlaying = true"
      @pause="isPlaying = false"
    ></video>
    <div class="controls">
      <div class="play-btn" @click="togglePlay">
        <cb-icon :name="isPlaying ? 'zanting' : 'bofang'" :size="'22px'" />
      </div>
      <div class="progress-wrap" @click="seekByClick">
        <div class="progress-bar">
          <div class="progress-inner" :style="{ width: percent + '%' }"></div>
        </div>
      </div>
      <span class="time">{{ currentDisplay }} / {{ durationDisplay }}</span>
    </div>
  </div>
</template>
<script setup lang="ts">
defineOptions({
  name: 'CbVideoPlayer',
})
// 视频播放器（业务 CbVideoPlayer 的库内最小实现）：
// 原生 video + 播放/暂停 + 进度条 + 时间显示，供文件预览等场景使用。
import { computed, ref } from 'vue'
withDefaults(
  defineProps<{
    src: string
    poster?: string
  }>(),
  {
    src: '',
    poster: '',
  }
)
const videoRef = ref<HTMLVideoElement | null>(null)
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const format = (ms: number) => {
  const total = Math.floor(ms)
  const m = String(Math.floor(total / 60)).padStart(2, '0')
  const s = String(total % 60).padStart(2, '0')
  return `${m}:${s}`
}
const currentDisplay = computed(() => format(currentTime.value))
const durationDisplay = computed(() => format(duration.value))
const percent = computed(() => {
  if (!duration.value) return 0
  return Math.min(100, (currentTime.value / duration.value) * 100)
})
const togglePlay = () => {
  if (!videoRef.value) return
  if (videoRef.value.paused) {
    videoRef.value.play()
  } else {
    videoRef.value.pause()
  }
}
const onTimeUpdate = () => {
  if (videoRef.value) currentTime.value = videoRef.value.currentTime
}
const onLoadedMetadata = () => {
  if (videoRef.value) duration.value = videoRef.value.duration || 0
}
const onEnded = () => {
  isPlaying.value = false
}
const seekByClick = (e: MouseEvent) => {
  const el = e.currentTarget as HTMLElement
  if (!videoRef.value || !el) return
  const rect = el.getBoundingClientRect()
  const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
  videoRef.value.currentTime = ratio * duration.value
  currentTime.value = videoRef.value.currentTime
}
defineExpose({
  play: () => videoRef.value?.play(),
  pause: () => videoRef.value?.pause(),
  seekTo: (t: number) => {
    if (videoRef.value) videoRef.value.currentTime = t
  },
  isPlaying,
  duration,
})
</script>
<style scoped lang="scss">
.cb-video-player {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #000;
  border-radius: 4px;
  overflow: hidden;
  video {
    flex: 1;
    width: 100%;
    min-height: 0;
    background: #000;
  }
  .controls {
    height: 44px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 0 12px;
    background: rgba(0, 0, 0, 0.75);
    .play-btn {
      color: #fff;
      cursor: pointer;
      display: flex;
      align-items: center;
    }
    .progress-wrap {
      flex: 1;
      cursor: pointer;
      .progress-bar {
        height: 4px;
        border-radius: 2px;
        background: rgba(255, 255, 255, 0.3);
        .progress-inner {
          height: 100%;
          border-radius: 2px;
          background: var(--td-brand-color, #0052d9);
          transition: width 0.1s linear;
        }
      }
    }
    .time {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.85);
      font-variant-numeric: tabular-nums;
      flex-shrink: 0;
    }
  }
}
</style>
