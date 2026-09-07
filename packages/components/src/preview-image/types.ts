/**
 * PreviewImage 图片预览组件类型
 * ----------------------------------------------------------------
 * 基于 TDesign t-image-viewer 封装：默认触发器展示首图 + 右下角放大图标，
 * 点击打开全屏预览；支持自定义触发器插槽、下载（阿里云 OSS 直接下载，
 * 其他地址新窗口打开）、暴露 open 方法。
 */

/**
 * PreviewImage 图片预览组件属性
 */
export interface PreviewImageProps {
  /**
   * 预览图片地址列表（至少 1 张，首图用于默认触发器展示）
   */
  images: string[]
  /**
   * 默认触发器宽度
   * @default '60px'
   */
  width?: string
  /**
   * 默认触发器高度
   * @default 'auto'
   */
  height?: string
  /**
   * 默认触发器最大高度
   * @default 'none'
   */
  maxHeight?: string
}
