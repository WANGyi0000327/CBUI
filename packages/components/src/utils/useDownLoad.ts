//使用XMLHttpRequest 配置了请求头来下载 现在使用的这个
import { MessagePlugin } from 'tdesign-vue-next'

export const downLoadXMLFile = async (src?: string) => {
  if (!src) {
    MessagePlugin.error('当前下载地址不存在')
    return
  }
  try {
    interface XHRResponse {
      blob: Blob
      status: number
      headers: string
    }
    const response = await new Promise<XHRResponse>((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      const url = src
      xhr.open('GET', url, true)
      xhr.responseType = 'blob' // 设置响应类型为blob
      // 设置请求头
      xhr.setRequestHeader(
        'accept',
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7'
      )
      xhr.setRequestHeader('accept-language', 'zh-CN,zh;q=0.9')
      xhr.setRequestHeader('cache-control', 'no-cache')
      xhr.setRequestHeader('pragma', 'no-cache')
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve({
            blob: xhr.response,
            status: xhr.status,
            headers: xhr.getAllResponseHeaders(),
          })
        } else {
          reject(new Error(`HTTP ${xhr.status}: ${xhr.statusText}`))
        }
      }
      xhr.onerror = () => {
        reject(new Error('网络请求失败'))
      }
      xhr.ontimeout = () => {
        reject(new Error('请求超时'))
      }
      // 设置超时时间（10秒）
      xhr.timeout = 10000
      xhr.send(null)
    })
    // 请求成功，处理下载
    const { blob } = response
    // 从URL提取文件名
    const urlParts = src.split('/')
    const lastPart = urlParts[urlParts.length - 1]
    let fileName = lastPart?.split('?')?.[0]
    if (!fileName) {
      // 根据blob类型推断文件类型
      const mimeType = blob.type
      const extension = mimeType.split('/')[1] || 'mp3'
      fileName = `录音文件.${extension}`
    }
    // 确保文件名有正确的扩展名
    if (!fileName.includes('.')) {
      const mimeType = blob.type
      const extension = mimeType.split('/')[1] || 'mp3'
      fileName = `${fileName}.${extension}`
    }
    // 检查文件大小
    if (blob.size === 0) {
      MessagePlugin.error('文件为空')
      throw new Error('文件为空')
    }
    // 创建下载链接
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    // 创建下载
    link.href = url
    link.download = fileName || 'unknown'
    // 添加到 DOM 并触发点击
    document.body.appendChild(link)
    link.click()
    // 清理
    setTimeout(() => {
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    }, 100)
    MessagePlugin.success('下载成功')
  } catch (error) {
    console.error('下载错误:', error)
    // 备用方案：直接链接下载
    console.log('尝试直接链接下载...')
    window.open(src, '_blank')
  }
}

/**
 * downloadFileBySaveAs：另存为下载文件
 * 原实现位于业务包 @repo/tdesign-ui（库内不存在），此处落地为库内工具。
 * @param url 文件地址
 * @param name 保存文件名（缺省用 url 末段）
 */
export const downloadFileBySaveAs = (url: string, name?: string) => {
  if (!url) return
  const fileName = name || url.split('/').pop()?.split('?')[0] || '文件'
  const a = document.createElement('a')
  a.href = url
  a.download = fileName
  a.target = '_blank'
  a.rel = 'noopener'
  document.body.appendChild(a)
  a.click()
  setTimeout(() => {
    document.body.removeChild(a)
  }, 100)
}
