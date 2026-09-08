import { describe, it, expect, beforeAll, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import VoiceToText from './VoiceToText.vue'
import type { TranscriptItem } from './types/toText'

// jsdom 未实现 scrollIntoView / HTMLMediaElement.play，需 mock
beforeAll(() => {
  Element.prototype.scrollIntoView = () => {}
  HTMLMediaElement.prototype.play = () => Promise.resolve()
  HTMLMediaElement.prototype.pause = () => {}
})

const transcripts: TranscriptItem[] = [
  { BeginTime: 0, EndTime: 3000, Text: '你好，请问有什么可以帮您', SpeakerId: '0' },
  { BeginTime: 3000, EndTime: 6000, Text: '我想查询一下我的订单', SpeakerId: '1' },
]

let seekToSpy: ReturnType<typeof vi.fn>
let playSpy: ReturnType<typeof vi.fn>

const mountVoice = (props = {}, options = {}) => {
  seekToSpy = vi.fn()
  playSpy = vi.fn()
  return mount(VoiceToText, {
    global: {
      stubs: {
        'cb-icon': { template: '<span class="stub-icon" />' },
        AudioPlayer: {
          template: '<div class="stub-audio" />',
          methods: { seekTo: seekToSpy, play: playSpy },
        },
        Select: true,
        CloudDownloadIcon: true,
      },
    },
    props: {
      transcripts,
      audioSrc: 'https://example.com/audio.mp3',
      ...props,
    },
    ...options,
  })
}

describe('CbVoiceToText', () => {
  it('渲染转文字消息（左 A / 右 B）', () => {
    const wrapper = mountVoice()
    const messages = wrapper.findAll('.message-wrapper')
    expect(messages.length).toBe(2)
    expect(wrapper.text()).toContain('你好，请问有什么可以帮您')
    expect(wrapper.text()).toContain('我想查询一下我的订单')
    expect(messages[0].classes()).toContain('message-left')
    expect(messages[1].classes()).toContain('message-right')
    // 头像 A / B
    expect(messages[0].find('.message-avatar').text()).toBe('A')
    expect(messages[1].find('.message-avatar').text()).toBe('B')
  })

  it('点击消息调用播放器 seekTo + play 跳转', async () => {
    const wrapper = mountVoice()
    // 点击第二条（BeginTime=3000）
    await wrapper.findAll('.message-wrapper')[1].trigger('click')
    expect(seekToSpy).toHaveBeenCalledWith(3000)
    expect(playSpy).toHaveBeenCalledTimes(1)
  })

  it('不传 transcripts 渲染空列表', () => {
    const wrapper = mountVoice({ transcripts: [] })
    expect(wrapper.findAll('.message-wrapper').length).toBe(0)
  })
})
