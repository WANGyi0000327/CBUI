/**
 * Copy 复制组件属性
 */
export interface CopyProps {
  /**
   * 要复制的文本内容
   * @required
   */
  copyText: string

  /**
   * 复制成功后的提示文案
   * @default '复制成功'
   */
  copySuccessText?: string
}
