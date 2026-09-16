import type { Ref } from 'vue'
// 转文字数据项类型定义
export interface TranscriptItem {
  ChannelId?: number // 频道ID，
  Text?: string // 文本内容
  EmotionValue?: number // 情绪值
  SilenceDuration?: number // 静默时长
  BeginTime: number // 开始时间（毫秒）
  EndTime: number // 结束时间（毫秒）
  SpeakerId?: string //0代表A，1代表B
}
// 组件属性定义
export interface Props {
  transcripts: TranscriptItem[] // 转文字数据数组
  audioSrc: string // 音频文件地址
  audioId?: string // 音频唯一标识，用于多实例管理
}
export interface AudioPlayerMethods {
  seekTo: (time: number) => void
  play: () => void
  pause: () => void
}
export interface AudioTranscriptHookProps {
  transcripts: TranscriptItem[]
  audioSrc: string
  audioId?: string
  isShowAudio?: boolean
}
export interface AudioTranscriptHookReturn {
  // Refs
  transcriptContainer: Ref<HTMLElement | null>
  itemRefs: Ref<(HTMLElement | null)[]>
  currentTranscriptIndex: Ref<number>
  currentTime: Ref<number>
  // Methods
  setItemRef: (el: HTMLElement | null, index: number) => void
  onTimeUpdate: (time: number) => void
  onEnded: () => void
  updateCurrentTranscript: () => void
  scrollToTranscript: (index: number) => Promise<void>
  onTranscriptClick: (time: number, seekTo: (time: number) => void, play: () => void) => void
}
