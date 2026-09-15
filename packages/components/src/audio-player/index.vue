<template>
  <div class="w-full">
    <div v-if="styletype === '1'" class="audio-player">
      <!-- 播放/暂停按钮 -->
      <div class="play-btn" @click="togglePlay">
        <CbIcon v-if="!isPlaying" :size="IconSize" :name="'bofang'" />
        <CbIcon v-else :size="IconSize" :name="'zanting'" />
      </div>
      <!-- 进度条区域 -->
      <div class="progress-wrapper" @click="seekByClick">
        <div class="progress-bar">
          <div class="progress-filled" :style="{ width: progressPercent + '%' }"></div>
          <div
            class="progress-handle"
            :style="{ left: progressPercent + '%' }"
            @mousedown.stop="startDrag"
          ></div>
        </div>
      </div>
      <!-- 时间显示 -->
      <div class="time-display">
        <span style="color: #999999">{{ currentTimeDisplay }}</span>
        / {{ durationDisplay }}
      </div>
      <!-- 【新增】倍速选择器 -->
      <div class="flex items-center">
        <div class="cover-select">
          <Select
            v-model="playbackRate"
            borderless
            style="width: 80px"
            class="!border-none"
            :options="[
              { label: '0.5倍', value: 0.5 },
              { label: '1倍', value: 1 },
              { label: '1.5倍', value: 1.5 },
              { label: '2倍', value: 2 },
            ]"
          >
          </Select>
        </div>
        <t-divider layout="vertical" />
        <div class="cursor-pointer w-[16px] ml-[8px]" @click="downLoadXMLFile(src)">
          <CloudDownloadIcon />
        </div>
      </div>
    </div>
    <div v-else class="audio-player2">
      <!-- 进度条区域 -->
      <!-- <div class="progress-wrapper" @click="seekByClick">
        <div class="progress-bar">
          <div
            class="progress-filled"
            :style="{ width: progressPercent + '%' }"
          ></div>
        </div>
      </div> -->
      <div class="play_bottom">
        <!-- 播放/暂停按钮 -->
        <div class="play-btn" @click="togglePlay">
          <CbIcon v-if="!isPlaying" :size="IconSize" :name="'bofang'" />
          <CbIcon v-else :size="IconSize" :name="'zanting'" />
        </div>
        <!-- 时间显示 -->
        <div class="time-display">
          <span style="color: #999999">{{ currentTimeDisplay }}</span>
        </div>
      </div>
    </div>
    <!-- 隐藏的音频元素 -->
    <audio
      ref="audioElement"
      :src="src"
      @timeupdate="onTimeUpdate"
      @loadedmetadata="onLoadedMetadata"
      @ended="onEnded"
      @play="onPlay"
      @pause="onPause"
    ></audio>
  </div>
</template>
<script setup lang="ts">
defineOptions({
  name: 'CbAudioPlayer',
})
import { onMounted, onUnmounted, ref, watch } from 'vue' // 【新增】补充ref、watch
import { useAudioPlayer } from './hooks/useAudioPlayer'
import type { Props, Emits } from './types/audio'
import { Select } from 'tdesign-vue-next'
import { CloudDownloadIcon } from 'tdesign-icons-vue-next'
import { downLoadXMLFile } from '#/utils/useDownLoad'
const props = withDefaults(defineProps<Props>(), {
  progressHeight: '8px',
  IconSize: '32px',
  styletype: '1',
  name: '通话录音',
})
const emit = defineEmits<Emits>()
// 使用音频播放器 Hook
const {
  audioElement,
  isPlaying,
  currentTimeDisplay,
  durationDisplay,
  progressPercent,
  togglePlay,
  seekByClick,
  startDrag,
  onPlay,
  onPause,
  onTimeUpdate,
  onLoadedMetadata,
  onEnded,
  play,
  pause,
  seekTo,
  registerAudio,
  cleanup,
  duration, // 新增：获取音频总时长（毫秒）
} = useAudioPlayer(props, emit)
// 【新增】倍速相关逻辑 - 完全独立，不修改原有代码
const playbackRate = ref<number>(1)
// 设置倍速方法
const setPlaybackRate = () => {
  if (!audioElement.value) return
  const validRate = Math.max(0.5, Math.min(4.0, Number(playbackRate.value)))
  audioElement.value.playbackRate = validRate
  playbackRate.value = validRate
}
// 监听倍速变化自动生效
watch(playbackRate, setPlaybackRate, { immediate: true })
// 暴露给父组件的方法
defineExpose({
  play,
  pause,
  seekTo,
  togglePlay,
  isPlaying,
  duration,
  durationDisplay,
  currentTimeDisplay,
  // 【新增】暴露倍速相关（可选，不影响原有暴露）
  playbackRate,
  setPlaybackRate,
})
// 生命周期钩子
onMounted(() => {
  registerAudio()
})
onUnmounted(() => {
  cleanup()
})
</script>
<style scoped lang="scss">
.audio-player {
  display: flex;
  align-items: center;
  gap: 16px;
}
.audio-player2 {
  display: flex;
  flex-direction: column;
  .play_bottom {
    display: flex;
    justify-content: space-between;
    align-items: center; /* 【新增】仅补充对齐，不修改原有样式 */
    gap: 8px; /* 【新增】仅补充间距，不修改原有样式 */
  }
}
.play-btn {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 50%;
  color: #25af60;
  cursor: pointer;
  transition: all 0.2s;
}
.progress-wrapper {
  flex: 1;
  padding: 4px 0;
  cursor: pointer;
}
.progress-bar {
  position: relative;
  height: v-bind(progressHeight);
  background: #d9d9d9;
  border-radius: 4px;
  overflow: visible;
}
.progress-filled {
  height: 100%;
  background: #10b981;
  border-radius: 4px;
  transition: width 0.1s linear;
}
.progress-handle {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 16px;
  height: 16px;
  background: #10b981;
  border: 2px solid #fff;
  border-radius: 50%;
  cursor: grab;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: transform 0.1s;
}
.progress-handle:hover {
  transform: translate(-50%, -50%) scale(1.2);
}
.progress-handle:active {
  cursor: grabbing;
}
/* 时间显示 */
.time-display {
  flex-shrink: 0;
  font-size: 14px;
  color: #999999;
  font-variant-numeric: tabular-nums;
  min-width: 44px;
  text-align: right;
}
/* 【新增】倍速选择器样式 - 完全独立，不修改原有样式 */
.speed-select-wrap {
  flex-shrink: 0;
}
.speed-select {
  padding: 4px 8px;
  border-radius: 4px;
  color: #666;
  font-size: 14px;
  cursor: pointer;
  outline: none;
}
.speed-select-wrap-sm {
  margin-left: 8px;
}
.speed-select-sm {
  padding: 2px 6px;
  font-size: 12px;
}
.cover-select {
  :deep(.t-select-input--borderless) {
    :deep(.t-input--focused) {
      border: none !important;
      box-shadow: none !important;
      background: transparent !important;
    }
  }
  .t-input:hover {
    border: none !important;
    box-shadow: none !important;
  }
}
</style>
