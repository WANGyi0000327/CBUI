/**
 * CbAudioPlayer 音频播放器组件入口
 * ----------------------------------------------------------------
 * 组件实体在本目录 index.vue，作为标准一级组件目录，
 * 进入组件库全量入口（gen:index / CBUI.install 全局注册 / 按需导出）。
 */
import CbAudioPlayer from './index.vue'
import type { Props as AudioPlayerProps } from './types/audio'

export { CbAudioPlayer }
export type { AudioPlayerProps }
export default CbAudioPlayer
