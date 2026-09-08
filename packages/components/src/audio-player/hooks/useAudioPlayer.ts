// hooks/useAudioPlayer.ts
import { ref, computed, watch, inject } from 'vue'
import { useAudioManager } from './useAudioManager'
export interface AudioPlayerProps {
  src: string
  audioId?: string
}
export interface AudioPlayerEmits {
  (e: 'play'): void
  (e: 'pause'): void
  (e: 'timeupdate', time: number): void
  (e: 'durationchange', duration: number): void
  (e: 'ended'): void
}
export function useAudioPlayer(
  props: AudioPlayerProps,
  emit: AudioPlayerEmits
) {
  // 音频管理器
  const audioManager = useAudioManager()
  // 3. 联系人详情文字转语音弹框里录音播放使用
  const audioPlayFunc = inject<() => void>('audioPlay', () => {
    console.log('audioPlay')
  })
  // 状态定义
  const audioElement = ref<HTMLAudioElement | null>(null)
  const isPlaying = ref(false)
  const currentTime = ref(0)
  const duration = ref(0)
  const isDragging = ref(false)
  // 生成内部音频 ID
  const internalAudioId = computed(
    () => props.audioId || `audio-${Date.now()}-${Math.random()}`
  )
  // 计算属性
  const currentTimeDisplay = computed(() => {
    const totalSeconds = Math.floor(currentTime.value / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  })
  const durationDisplay = computed(() => {
    const totalSeconds = Math.floor(duration.value / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  })
  const progressPercent = computed(() => {
    if (duration.value === 0) return 0
    return (currentTime.value / duration.value) * 100
  })
  // 播放控制函数
  const play = () => {
    if (!audioElement.value) return
    audioManager.requestPlay(internalAudioId.value)
    audioElement.value.play()
  }
  const pause = () => {
    if (!audioElement.value) return
    audioElement.value.pause()
  }
  const seekTo = (timeMs: number) => {
    if (!audioElement.value) return
    audioElement.value.currentTime = timeMs / 1000
    currentTime.value = timeMs
  }
  const togglePlay = () => {
    if (!audioElement.value) return
    if (isPlaying.value) {
      pause()
    } else {
      play()
    }
  }
  // 事件处理函数
  const onPlay = () => {
    isPlaying.value = true
    emit('play')
    audioPlayFunc()
  }
  const onPause = () => {
    isPlaying.value = false
    audioManager.notifyPause(internalAudioId.value)
    emit('pause')
  }
  const onTimeUpdate = () => {
    if (!audioElement.value || isDragging.value) return
    currentTime.value = audioElement.value.currentTime * 1000
    emit('timeupdate', currentTime.value)
  }
  const onLoadedMetadata = () => {
    if (!audioElement.value) return
    duration.value = audioElement.value.duration * 1000
    emit('durationchange', duration.value)
  }
  const onEnded = () => {
    isPlaying.value = false
    audioManager.notifyPause(internalAudioId.value)
    emit('ended')
  }
  const seekByClick = (event: MouseEvent) => {
    if (!audioElement.value) return
    const target = event.currentTarget as HTMLElement
    const rect = target.getBoundingClientRect()
    const percent = (event.clientX - rect.left) / rect.width
    const newTime = percent * duration.value
    seekTo(newTime)
    emit('timeupdate', newTime)
  }
  const startDrag = (event: MouseEvent) => {
    isDragging.value = true
    event.preventDefault()
    const onMouseMove = (e: MouseEvent) => {
      if (!audioElement.value || !isDragging.value) return
      const progressWrapper = (event.target as HTMLElement).closest(
        '.progress-wrapper'
      ) as HTMLElement
      if (!progressWrapper) return
      const rect = progressWrapper.getBoundingClientRect()
      let percent = (e.clientX - rect.left) / rect.width
      percent = Math.max(0, Math.min(1, percent))
      const newTime = percent * duration.value
      currentTime.value = newTime
      audioElement.value.currentTime = newTime / 1000
      emit('timeupdate', newTime)
    }
    const onMouseUp = () => {
      isDragging.value = false
      emit('timeupdate', currentTime.value)
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }
  // 初始化注册
  const registerAudio = () => {
    audioManager.register(internalAudioId.value, { pause, play })
  }
  // 清理函数
  const cleanup = () => {
    audioManager.unregister(internalAudioId.value)
    if (audioElement.value) {
      audioElement.value.pause()
    }
  }
  // 监听音频源变化
  watch(
    () => props.src,
    () => {
      if (audioElement.value) {
        // 重置状态
        isPlaying.value = false
        currentTime.value = 0
        duration.value = 0
      }
    }
  )
  // 返回所有需要暴露的变量和方法
  return {
    // 响应式引用
    audioElement,
    isPlaying,
    currentTime,
    duration,
    isDragging,
    // 计算属性
    currentTimeDisplay,
    durationDisplay,
    progressPercent,
    // 方法
    play,
    pause,
    seekTo,
    togglePlay,
    seekByClick,
    startDrag,
    // 事件处理
    onPlay,
    onPause,
    onTimeUpdate,
    onLoadedMetadata,
    onEnded,
    // 生命周期
    registerAudio,
    cleanup,
  }
}
