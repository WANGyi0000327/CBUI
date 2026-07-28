/**
 * CB UI 工具函数
 * ------------------------------------------------------------
 * 提供组件库内部使用的通用工具方法
 */

/**
 * 生成唯一 ID
 * @param prefix 前缀
 * @returns 带前缀的唯一 ID
 */
export function uid(prefix = 'cb'): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`
}

/**
 * 判断值是否为空（null、undefined、空字符串、空数组、空对象）
 * @param val 待判断的值
 */
export function isEmpty(val: unknown): boolean {
  if (val === null || val === undefined || val === '') return true
  if (Array.isArray(val)) return val.length === 0
  if (typeof val === 'object') return Object.keys(val as object).length === 0
  return false
}

/**
 * 防抖函数
 * @param fn 目标函数
 * @param delay 延迟毫秒
 */
export function debounce<T extends (...args: any[]) => any>(fn: T, delay = 200): T {
  let timer: ReturnType<typeof setTimeout> | null = null
  return ((...args: any[]) => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }) as T
}

/**
 * 节流函数
 * @param fn 目标函数
 * @param delay 间隔毫秒
 */
export function throttle<T extends (...args: any[]) => any>(fn: T, delay = 200): T {
  let last = 0
  return ((...args: any[]) => {
    const now = Date.now()
    if (now - last >= delay) {
      last = now
      fn(...args)
    }
  }) as T
}

/**
 * 深拷贝
 * @param obj 待拷贝对象
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj.getTime()) as T
  if (obj instanceof Array) return obj.map((item) => deepClone(item)) as T
  if (obj instanceof Object) {
    const cloned: Record<string, unknown> = {}
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        cloned[key] = deepClone((obj as Record<string, unknown>)[key])
      }
    }
    return cloned as T
  }
  return obj
}

/**
 * 将驼峰命名转为短横线命名
 * @param str 驼峰字符串
 * @example camelToKebab('ButtonSize') => 'button-size'
 */
export function camelToKebab(str: string): string {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
}

/**
 * 将短横线命名转为驼峰命名
 * @param str 短横线字符串
 * @example kebabToCamel('button-size') => 'buttonSize'
 */
export function kebabToCamel(str: string): string {
  return str.replace(/-([a-z])/g, (_, char) => char.toUpperCase())
}

export default {
  uid,
  isEmpty,
  debounce,
  throttle,
  deepClone,
  camelToKebab,
  kebabToCamel,
}
