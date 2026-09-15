import { describe, it, expect, beforeAll, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import CbAudioPlayer from './index.vue'

// jsdom 未实现 HTMLMediaElement.play / pause，需 mock
beforeAll(() => {
  HTMLMediaElement.prototype.play = vi.fn(() => Promise.resolve())
  HTMLMediaElement.prototype.pause = vi.fn()
})

const mountPlayer = (props = {}, options = {}) =>
  mount(CbAudioPlayer, {
    global: {
      stubs: {
        'cb-icon': { template: '<span class="stub-icon" />' },
        Select: true,
        CloudDownloadIcon: true,
      },
    },
    props: { src: 'https://example.com/audio.mp3', ...props },
    ...options,
  })

describe('CbAudioPlayer', () => {
  it('styletype=1 渲染完整播放器（进度条/时间/倍速/下载）', () => {
    const wrapper = mountPlayer()
    expect(wrapper.find('.audio-player').exists()).toBe(true)
    expect(wrapper.find('.audio-player2').exists()).toBe(false)
    expect(wrapper.find('.progress-bar').exists()).toBe(true)
    expect(wrapper.text()).toContain('00:00')
    expect(wrapper.find('audio').exists()).toBe(true)
    expect(wrapper.find('audio').attributes('src')).toBe('https://example.com/audio.mp3')
  })

  it('styletype=2 渲染精简样式', () => {
    const wrapper = mountPlayer({ styletype: '2' })
    expect(wrapper.find('.audio-player2').exists()).toBe(true)
    expect(wrapper.find('.audio-player').exists()).toBe(false)
    expect(wrapper.find('.progress-bar').exists()).toBe(false)
  })

  it('点击播放按钮触发 audio.play', async () => {
    const wrapper = mountPlayer()
    const audio = wrapper.find('audio').element as HTMLMediaElement
    const playSpy = vi.spyOn(audio, 'play').mockImplementation(() => Promise.resolve())
    await wrapper.find('.play-btn').trigger('click')
    expect(playSpy).toHaveBeenCalled()
  })

  it('暴露 seekTo / play / pause / togglePlay 方法', () => {
    const wrapper = mountPlayer()
    expect(typeof wrapper.vm.seekTo).toBe('function')
    expect(typeof wrapper.vm.play).toBe('function')
    expect(typeof wrapper.vm.pause).toBe('function')
    expect(typeof wrapper.vm.togglePlay).toBe('function')
    expect(typeof wrapper.vm.setPlaybackRate).toBe('function')
  })
})
