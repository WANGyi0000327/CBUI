/**
 * CbVoiceToText 音频转文字组件入口
 * ----------------------------------------------------------------
 * SFC 内部 defineOptions name 为 'CbVoiceToText'（符合 Cb 前缀约定），
 * 因此无需 HOC 包装层，此文件仅作为导出门面（barrel），
 * 供 gen:index 扫描与 resolver 按需加载。
 */
import VoiceToText from './VoiceToText.vue'
import type { AudioTranscriptHookProps, TranscriptItem } from './types/toText'

export { VoiceToText }
export type { AudioTranscriptHookProps, TranscriptItem }
export default VoiceToText
