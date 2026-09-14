import { describe, it, expect, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import ImageSecret from './ImageSecret.vue'

// serviceManager shim：getFileTempUrl 原样返回（与 config/api.ts 一致）
const mountSecret = (props = {}) =>
  mount(ImageSecret, {
    props: { tempUrl: '', ...props },
  })

describe('CbImageSecret', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  it('http 链接直接作为 img src', async () => {
    const wrapper = mountSecret({ tempUrl: 'https://example.com/a.jpg' })
    await flushPromises()
    const img = wrapper.find('img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe('https://example.com/a.jpg')
  })

  it('业务文件路径经 serviceManager 转换后作为 img src', async () => {
    const wrapper = mountSecret({ tempUrl: '/files/photo.jpg' })
    await flushPromises()
    const img = wrapper.find('img')
    expect(img.exists()).toBe(true)
    // shim getFileTempUrl 原样返回
    expect(img.attributes('src')).toBe('/files/photo.jpg')
  })

  it('tempUrl 变化时重新加载', async () => {
    const wrapper = mountSecret({ tempUrl: '/files/a.jpg' })
    await flushPromises()
    await wrapper.setProps({ tempUrl: 'https://example.com/b.jpg' })
    await flushPromises()
    const img = wrapper.find('img')
    expect(img.attributes('src')).toBe('https://example.com/b.jpg')
  })
})
