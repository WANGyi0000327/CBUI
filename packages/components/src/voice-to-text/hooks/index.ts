import { ref, nextTick, watch } from 'vue'
import type { AudioTranscriptHookProps, AudioTranscriptHookReturn } from '../types/toText'
export const useAudioTranscript = (props: AudioTranscriptHookProps): AudioTranscriptHookReturn => {
  // 转文字相关状态
  const transcriptContainer = ref<HTMLElement | null>(null)
  const itemRefs = ref<(HTMLElement | null)[]>([])
  const currentTranscriptIndex = ref<number>(-1)
  const currentTime = ref(0)
  // 设置消息元素引用
  const setItemRef = (el: HTMLElement | null, index: number) => {
    if (el) {
      itemRefs.value[index] = el
    }
  }
  // 音频时间更新事件处理
  const onTimeUpdate = (time: number) => {
    currentTime.value = time
    updateCurrentTranscript()
  }
  // 音频播放结束事件处理
  const onEnded = () => {
    currentTranscriptIndex.value = -1
  }
  // 根据当前播放时间更新高亮的转文字
  const updateCurrentTranscript = () => {
    const currentMs = currentTime.value
    // 查找当前时间对应的转文字索引
    const index = props.transcripts.findIndex(
      (item) => currentMs >= item.BeginTime && currentMs <= item.EndTime
    )
    if (index !== -1 && index !== currentTranscriptIndex.value) {
      currentTranscriptIndex.value = index
      scrollToTranscript(index)
    } else if (index === -1) {
      // 如果在两个片段之间，查找下一个转文字
      const nextIndex = props.transcripts.findIndex((item) => currentMs < item.BeginTime)
      if (nextIndex !== -1 && nextIndex !== currentTranscriptIndex.value) {
        currentTranscriptIndex.value = nextIndex
        scrollToTranscript(nextIndex)
      }
    }
  }
  // 滚动到指定的转文字位置
  const scrollToTranscript = async (index: number) => {
    await nextTick()
    const container = transcriptContainer.value
    const targetElement = itemRefs.value[index]
    if (!container || !targetElement) return
    const containerRect = container.getBoundingClientRect()
    const targetRect = targetElement.getBoundingClientRect()
    // 计算滚动位置，使目标元素居中显示
    const scrollTop =
      targetElement.offsetTop -
      container.offsetTop -
      containerRect.height / 2 +
      targetRect.height / 2
    container.scrollTo({
      top: scrollTop,
      behavior: 'smooth',
    })
  }
  // 跳转到指定时间并播放
  const onTranscriptClick = (time: number, seekTo: (time: number) => void, play: () => void) => {
    seekTo(time)
    play()
  }
  // 监听 transcripts 变化，重置引用数组
  watch(
    () => props.transcripts,
    () => {
      itemRefs.value = []
    },
    { deep: true }
  )
  return {
    // Refs
    transcriptContainer,
    itemRefs,
    currentTranscriptIndex,
    currentTime,
    // Methods
    setItemRef,
    onTimeUpdate,
    onEnded,
    updateCurrentTranscript,
    scrollToTranscript,
    onTranscriptClick,
  }
}
