import { ref } from 'vue'
// 当前正在播放的音频ID
const currentPlayingId = ref<string | null>(null)
// 所有音频实例的注册表
const audioInstances = new Map<
  string,
  {
    pause: () => void
    play: () => void
  }
>()
/**
 * 全局音频管理器
 * 用于管理多个音频播放器实例，确保同时只有一个在播放
 */
export function useAudioManager() {
  /**
   * 注册音频实例
   * @param id 音频唯一标识
   * @param controls 音频控制方法
   */
  const register = (id: string, controls: { pause: () => void; play: () => void }) => {
    audioInstances.set(id, controls)
  }
  /**
   * 注销音频实例
   * @param id 音频唯一标识
   */
  const unregister = (id: string) => {
    audioInstances.delete(id)
    if (currentPlayingId.value === id) {
      currentPlayingId.value = null
    }
  }
  /**
   * 请求播放权限
   * 当一个音频开始播放时，会暂停其他所有正在播放的音频
   * @param id 音频唯一标识
   */
  const requestPlay = (id: string) => {
    // 如果有其他音频正在播放，先暂停它
    if (currentPlayingId.value && currentPlayingId.value !== id) {
      const prevInstance = audioInstances.get(currentPlayingId.value)
      if (prevInstance) {
        prevInstance.pause()
      }
    }
    // 设置当前播放的音频ID
    currentPlayingId.value = id
  }
  /**
   * 通知音频已暂停
   * @param id 音频唯一标识
   */
  const notifyPause = (id: string) => {
    if (currentPlayingId.value === id) {
      currentPlayingId.value = null
    }
  }
  /**
   * 检查是否是当前正在播放的音频
   * @param id 音频唯一标识
   */
  const isCurrentPlaying = (id: string) => {
    return currentPlayingId.value === id
  }
  return {
    register,
    unregister,
    requestPlay,
    notifyPause,
    isCurrentPlaying,
  }
}
