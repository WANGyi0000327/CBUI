/**
 * AlphaBgColor：基于主题色（--td-brand-color）生成透明背景色
 * ----------------------------------------------------------------
 * 原实现位于业务包 @repo/tdesign-ui，此处落地为库内工具。
 * 额外处理：
 * 1. SSR 安全（build:docs 为服务端渲染，window/document 不存在时返回兜底色）
 * 2. hexToRgba 兜底：非合法 hex（空 / rgb() / 自定义变量）时返回中性黑透明色
 */

/** hex 颜色转 rgba 字符串（非法输入回退 rgba(0,0,0,alpha)） */
const hexToRgba = (hex: string, alpha: number): string => {
  let value = (hex || '').trim().replace('#', '')
  if (!value) return `rgba(0, 0, 0, ${alpha})`
  if (value.length === 3) {
    value = value
      .split('')
      .map((c) => c + c)
      .join('')
  }
  if (!/^[0-9a-fA-F]{6}$/.test(value)) return `rgba(0, 0, 0, ${alpha})`
  const r = parseInt(value.slice(0, 2), 16)
  const g = parseInt(value.slice(2, 4), 16)
  const b = parseInt(value.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

/**
 * 从 CSS 变量获取主题色并转为带透明度的 rgba
 * @param alpha 透明度，默认 0.1
 */
export const AlphaBgColor = (alpha: number = 0.1) => {
  // 从CSS变量中获取主题色
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    // SSR 环境无 window/document，返回中性兜底色
    return hexToRgba('', alpha)
  }
  const style = window.getComputedStyle(document.documentElement)
  const brandColor = style.getPropertyValue('--td-brand-color').trim()
  // 使用主题色并设置透明度为0.1
  return hexToRgba(brandColor, alpha)
}
