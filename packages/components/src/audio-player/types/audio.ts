// 组件属性定义
export interface Props {
  src: string
  audioId?: string
  progressHeight?: string
  IconSize?: string
  styletype?: string
  name?: string
}
// 组件事件定义
export interface Emits {
  (e: 'timeupdate', time: number): void
  (e: 'durationchange', duration: number): void
  (e: 'ended'): void
  (e: 'play'): void
  (e: 'pause'): void
}
