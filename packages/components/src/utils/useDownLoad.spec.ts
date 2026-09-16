import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { MessagePlugin } from 'tdesign-vue-next'
import { downLoadXMLFile, downloadFileBySaveAs } from './useDownLoad'

vi.mock('tdesign-vue-next', () => ({
  MessagePlugin: { error: vi.fn(), success: vi.fn() },
}))

// 可配置的 FakeXHR：同步触发 onload / onerror / ontimeout
class FakeXHR {
  static trigger: 'success' | 'error' | 'timeout' | 'http-error' = 'success'
  static httpStatus = 200
  static responseBlob = new Blob(['fake'], { type: 'audio/mp3' })
  static sent: string | null = null

  status = 200
  statusText = 'OK'
  response: unknown = new Blob()
  timeout = 0
  responseType = ''
  onload: (() => void) | null = null
  onerror: (() => void) | null = null
  ontimeout: (() => void) | null = null
  open = vi.fn()
  setRequestHeader = vi.fn()
  getAllResponseHeaders = () => 'content-type: audio/mp3'
  send = vi.fn(() => {
    FakeXHR.sent = this.responseType
    this.status = FakeXHR.httpStatus
    this.statusText = FakeXHR.httpStatus === 200 ? 'OK' : 'Not Found'
    this.response = FakeXHR.responseBlob
    if (FakeXHR.trigger === 'error') this.onerror?.()
    else if (FakeXHR.trigger === 'timeout') this.ontimeout?.()
    else if (FakeXHR.trigger === 'http-error') this.onload?.()
    else this.onload?.()
  })
}

const mockCreate = vi.fn(() => 'blob:mock-url')
const mockRevoke = vi.fn()
const mockOpen = vi.fn()

beforeEach(() => {
  vi.clearAllMocks()
  FakeXHR.trigger = 'success'
  FakeXHR.httpStatus = 200
  FakeXHR.responseBlob = new Blob(['fake'], { type: 'audio/mp3' })
  FakeXHR.sent = null
  vi.stubGlobal('XMLHttpRequest', FakeXHR)
  URL.createObjectURL = mockCreate
  URL.revokeObjectURL = mockRevoke
  window.open = mockOpen as unknown as typeof window.open
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('downLoadXMLFile 下载', () => {
  it('src 为空时提示错误且不发起请求', async () => {
    await downLoadXMLFile()
    expect(MessagePlugin.error).toHaveBeenCalledWith('当前下载地址不存在')
    expect(FakeXHR.sent).toBeNull()
  })

  it('请求成功：解析文件名并触发下载', async () => {
    await downLoadXMLFile('https://x.com/files/report.mp3?token=1')
    expect(MessagePlugin.success).toHaveBeenCalledWith('下载成功')
    expect(mockCreate).toHaveBeenCalled()
    expect(window.open).not.toHaveBeenCalled()
  })

  it('响应 blob 类型为 audio/mp3 时设置 responseType 为 blob', async () => {
    await downLoadXMLFile('https://x.com/files/a.mp3')
    expect(FakeXHR.sent).toBe('blob')
  })

  it('文件名无扩展名时按 blob 类型补扩展名', async () => {
    await downLoadXMLFile('https://x.com/files/recording')
    expect(MessagePlugin.success).toHaveBeenCalledWith('下载成功')
  })

  it('URL 末段为空时按 blob 类型推断文件名', async () => {
    await downLoadXMLFile('https://x.com/files/')
    expect(MessagePlugin.success).toHaveBeenCalledWith('下载成功')
  })

  it('HTTP 非 2xx 时降级为 window.open', async () => {
    FakeXHR.trigger = 'http-error'
    FakeXHR.httpStatus = 404
    await downLoadXMLFile('https://x.com/files/a.mp3')
    expect(window.open).toHaveBeenCalledWith('https://x.com/files/a.mp3', '_blank')
  })

  it('网络错误时降级为 window.open', async () => {
    FakeXHR.trigger = 'error'
    await downLoadXMLFile('https://x.com/files/a.mp3')
    expect(window.open).toHaveBeenCalled()
  })

  it('请求超时时降级为 window.open', async () => {
    FakeXHR.trigger = 'timeout'
    await downLoadXMLFile('https://x.com/files/a.mp3')
    expect(window.open).toHaveBeenCalled()
  })

  it('blob 大小为 0 时提示错误并降级', async () => {
    FakeXHR.responseBlob = new Blob([])
    await downLoadXMLFile('https://x.com/files/a.mp3')
    expect(MessagePlugin.error).toHaveBeenCalledWith('文件为空')
    expect(window.open).toHaveBeenCalled()
  })
})

describe('downloadFileBySaveAs 另存为下载', () => {
  it('url 为空时直接返回', () => {
    downloadFileBySaveAs('')
    expect(mockCreate).not.toHaveBeenCalled()
  })

  it('正常触发 a 标签下载', () => {
    downloadFileBySaveAs('https://x.com/files/a.pdf')
    const anchors = document.querySelectorAll('a[download]')
    expect(anchors.length).toBeGreaterThan(0)
  })

  it('name 缺省时取 URL 末段为文件名', () => {
    downloadFileBySaveAs('https://x.com/files/b.pdf')
    // 取最新添加的 a[download]（前序测试的异步清理可能尚未执行）
    const anchors = document.querySelectorAll('a[download]')
    const anchor = anchors[anchors.length - 1] as HTMLAnchorElement
    expect(anchor.download).toBe('b.pdf')
  })
})
