import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import VideoPlayer from './index.vue'

describe('CbVideoPlayer', () => {
  beforeEach(() => {
    // happy-dom 的 HTMLMediaElement 无真实 play/pause 实现，mock 掉
    Object.defineProperty(HTMLMediaElement.prototype, 'play', {
      value: vi.fn().mockResolvedValue(undefined),
      configurable: true,
    })
    Object.defineProperty(HTMLMediaElement.prototype, 'pause', {
      value: vi.fn(),
      configurable: true,
    })
  })

  const mountPlayer = (props = {}) =>
    mount(VideoPlayer, {
      global: {
        stubs: {
          'cb-icon': { template: '<span class="stub-icon" />' },
        },
      },
      props: { src: 'https://example.com/v.mp4', poster: 'p.jpg', ...props },
    })

  it('渲染 video 并绑定 src / poster', () => {
    const wrapper = mountPlayer()
    const video = wrapper.find('video')
    expect(video.exists()).toBe(true)
    expect(video.attributes('src')).toBe('https://example.com/v.mp4')
    expect(video.attributes('poster')).toBe('p.jpg')
  })

  it('初始显示 00:00 / 00:00', () => {
    const wrapper = mountPlayer()
    expect(wrapper.find('.time').text()).toBe('00:00 / 00:00')
  })

  it('点击播放按钮调用 play / pause', async () => {
    const wrapper = mountPlayer()
    const play = HTMLMediaElement.prototype.play as unknown as ReturnType<
      typeof vi.fn
    >
    const pause = HTMLMediaElement.prototype.pause as unknown as ReturnType<
      typeof vi.fn
    >
    // happy-dom 默认 paused=true -> 第一次点击调用 play
    await wrapper.find('.play-btn').trigger('click')
    expect(play).toHaveBeenCalled()
    // 手动翻转 paused 状态模拟播放中 -> 第二次点击调用 pause
    Object.defineProperty(wrapper.find('video').element, 'paused', {
      value: false,
      configurable: true,
    })
    await wrapper.find('.play-btn').trigger('click')
    expect(pause).toHaveBeenCalled()
  })

  it('loadedmetadata 后更新时长显示', async () => {
    const wrapper = mountPlayer()
    const video = wrapper.find('video')
    Object.defineProperty(video.element, 'duration', { value: 125 })
    await video.trigger('loadedmetadata')
    expect(wrapper.find('.time').text()).toBe('00:00 / 02:05')
  })

  it('timeupdate 后更新当前时间与进度条', async () => {
    const wrapper = mountPlayer()
    const video = wrapper.find('video')
    Object.defineProperty(video.element, 'duration', { value: 120 })
    await video.trigger('loadedmetadata')
    Object.defineProperty(video.element, 'currentTime', { value: 65 })
    await video.trigger('timeupdate')
    expect(wrapper.find('.time').text()).toBe('01:05 / 02:00')
    const inner = wrapper.find('.progress-inner')
    expect(inner.attributes('style')).toContain('width: 54.16')
  })

  it('点击进度条跳转进度', async () => {
    const wrapper = mountPlayer()
    const video = wrapper.find('video')
    Object.defineProperty(video.element, 'duration', { value: 100 })
    await video.trigger('loadedmetadata')
    // mock getBoundingClientRect：left=0 width=100
    const el = wrapper.find('.progress-wrap').element
    vi.spyOn(el, 'getBoundingClientRect').mockReturnValue({
      left: 0,
      width: 100,
      top: 0,
      right: 100,
      bottom: 0,
      height: 0,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    } as DOMRect)
    await wrapper.find('.progress-wrap').trigger('click', { clientX: 50 })
    await nextTick()
    expect(wrapper.find('.time').text()).toBe('00:50 / 01:40')
  })

  it('暴露 play / pause / seekTo / isPlaying / duration 实例', () => {
    const wrapper = mountPlayer()
    const vm = wrapper.vm as unknown as {
      play: () => void
      pause: () => void
      seekTo: (t: number) => void
      isPlaying: boolean
      duration: number
    }
    expect(typeof vm.play).toBe('function')
    expect(typeof vm.pause).toBe('function')
    expect(typeof vm.seekTo).toBe('function')
    // defineExpose 的 ref 自动解包
    expect(vm.isPlaying).toBe(false)
    expect(vm.duration).toBe(0)
  })
})
