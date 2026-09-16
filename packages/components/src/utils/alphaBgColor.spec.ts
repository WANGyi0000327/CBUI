import { describe, it, expect, afterEach, vi } from 'vitest'
import { AlphaBgColor } from './alphaBgColor'

const setBrandColor = (value: string) => {
  document.documentElement.style.setProperty('--td-brand-color', value)
}

afterEach(() => {
  document.documentElement.style.removeProperty('--td-brand-color')
  vi.unstubAllGlobals()
})

describe('AlphaBgColor 主题色透明背景', () => {
  it('默认 alpha 0.1，6 位 hex 转 rgba', () => {
    setBrandColor('#0052d9')
    expect(AlphaBgColor()).toBe('rgba(0, 82, 217, 0.1)')
  })

  it('支持自定义 alpha', () => {
    setBrandColor('#0052d9')
    expect(AlphaBgColor(0.3)).toBe('rgba(0, 82, 217, 0.3)')
  })

  it('支持 3 位 hex 自动展开', () => {
    setBrandColor('#fff')
    expect(AlphaBgColor()).toBe('rgba(255, 255, 255, 0.1)')
  })

  it('非法颜色值回退中性黑', () => {
    setBrandColor('rgb(0, 82, 217)')
    expect(AlphaBgColor()).toBe('rgba(0, 0, 0, 0.1)')
  })

  it('SSR 环境（无 window）返回兜底色', () => {
    vi.stubGlobal('window', undefined)
    expect(AlphaBgColor()).toBe('rgba(0, 0, 0, 0.1)')
  })
})
