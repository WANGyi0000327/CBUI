import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Copy from './Copy.vue'

// Mock MessagePlugin 与剪贴板
vi.mock('tdesign-vue-next', async (importOriginal) => {
  const mod = (await importOriginal()) as Record<string, unknown>
  return {
    ...mod,
    MessagePlugin: {
      success: vi.fn(),
      warning: vi.fn(),
    },
  }
})

import { MessagePlugin } from 'tdesign-vue-next'
const mockedSuccess = MessagePlugin.success as ReturnType<typeof vi.fn>

const mountCopy = (props = {}) =>
  mount(Copy, {
    global: {
      stubs: {
        'cb-icon': {
          emits: ['click'],
          template: '<span class="stub-icon" @click="$emit(\'click\')" />',
        },
      },
    },
    props: { copyText: 'hello world', ...props },
  })

describe('CbCopy', () => {
  beforeEach(() => {
    mockedSuccess.mockClear()
  })

  it('渲染复制图标', () => {
    const wrapper = mountCopy()
    expect(wrapper.find('.stub-icon').exists()).toBe(true)
  })

  it('点击时写入剪贴板并提示成功', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
    })
    const wrapper = mountCopy()
    await wrapper.find('.stub-icon').trigger('click')
    await Promise.resolve()
    expect(writeText).toHaveBeenCalledWith('hello world')
    expect(mockedSuccess).toHaveBeenCalledWith('复制成功', 1000)
  })

  it('copyText 为空时不复制', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: vi.fn() },
      configurable: true,
    })
    const wrapper = mountCopy({ copyText: '' })
    await wrapper.find('.stub-icon').trigger('click')
    expect((navigator.clipboard as Clipboard).writeText).not.toHaveBeenCalled()
    expect(mockedSuccess).not.toHaveBeenCalled()
  })

  it('无 navigator.clipboard 时回退 execCommand 复制', async () => {
    // 覆盖为 undefined own property：屏蔽 happy-dom 原型上的 clipboard
    Object.defineProperty(navigator, 'clipboard', {
      value: undefined,
      configurable: true,
      writable: true,
    })
    const execCommand = vi.fn(() => true)
    document.execCommand = execCommand as unknown as typeof document.execCommand
    // happy-dom 的 input.select 可能未实现，stub 掉
    vi.spyOn(HTMLInputElement.prototype, 'select').mockImplementation(() => {})
    const wrapper = mountCopy()
    await wrapper.find('.stub-icon').trigger('click')
    await Promise.resolve()
    expect(execCommand).toHaveBeenCalledWith('copy')
    expect(mockedSuccess).toHaveBeenCalled()
  })
})
