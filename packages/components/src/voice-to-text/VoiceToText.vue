<template>
  <div class="audio-transcript">
    <!-- 转文字内容区域 -->
    <div ref="transcriptContainer" class="transcript-container">
      <div class="transcript-messages">
        <div
          v-for="(item, index) in transcripts"
          :key="index"
          :ref="(el) => handleSetItemRef(el, index)"
          :class="['message-wrapper', item.SpeakerId === '0' ? 'message-left' : 'message-right']"
          @click="handleTranscriptClick(item.BeginTime)"
        >
          <!-- 对话头像 -->
          <div class="message-avatar">
            {{ item.SpeakerId === '0' ? 'A' : 'B' }}
          </div>
          <!-- 消息气泡 -->
          <div :class="['message-bubble', { active: currentTranscriptIndex === index }]">
            {{ item.Text }}
          </div>
        </div>
      </div>
    </div>
    <!-- 音频播放器 -->
    <div style="margin: 16px 60px 0 60px">
      <AudioPlayer
        ref="audioPlayerRef"
        :src="audioSrc"
        :audio-id="internalAudioId"
        @timeupdate="onTimeUpdate"
        @durationchange="onDurationChange"
        @ended="onEnded"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
defineOptions({
  name: 'CbVoiceToText',
})
import AudioPlayer from '../audio-player/index.vue'
import { computed, ref } from 'vue'
import { useAudioTranscript } from './hooks/index'
import type { AudioPlayerMethods, AudioTranscriptHookProps } from './types/toText'
const props = defineProps<AudioTranscriptHookProps>()
defineEmits(['close'])
const internalAudioId = computed(() => props.audioId || `transcript-audio-${Date.now()}`)
const audioPlayerRef = ref<AudioPlayerMethods | null>(null)
// 使用 audio transcript hooks
const {
  transcriptContainer,
  currentTranscriptIndex,
  setItemRef,
  onTimeUpdate,
  onEnded,
  onTranscriptClick,
} = useAudioTranscript({
  transcripts: props.transcripts,
  audioId: internalAudioId.value,
  audioSrc: props.audioSrc,
})
console.log(props.audioSrc, internalAudioId)
// 处理转文字点击事件
const handleTranscriptClick = (time: number) => {
  if (!audioPlayerRef.value) return
  onTranscriptClick(time, audioPlayerRef.value.seekTo, audioPlayerRef.value.play)
}
// ref 回调包装：模板 ref 元素类型较宽，收敛为 HTMLElement | null
const handleSetItemRef = (el: unknown, index: number) => {
  setItemRef(el as HTMLElement | null, index)
}
const onDurationChange = (duration: number) => {
  console.log('🌵-----duration-----', duration)
}
</script>
<style scoped>
/* 原有的样式保持不变 */
.audio-transcript {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 320px;
}
.transcript-container {
  padding: 16px 16px;
  flex: 1;
  overflow-y: auto;
  border-bottom: 1px solid #e5e7eb;
}
.transcript-messages {
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin: 0 auto;
}
.message-wrapper {
  width: calc(100% - 60px);
  display: flex;
  gap: 20px;
  align-items: center;
  cursor: pointer;
}
.message-left {
  flex-direction: row;
}
.message-right {
  flex-direction: row-reverse;
  margin-left: auto;
}
.message-avatar {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 16px;
  font-weight: 600;
}
.message-left .message-avatar {
  background: var(--cca-47-a-01, #cca47a1a);
  color: #cca47a;
}
.message-right .message-avatar {
  background: var(--25-af-6001, #25af601a);
  color: #25af60;
}
.transcript-container::-webkit-scrollbar {
  display: none !important;
}
</style>
