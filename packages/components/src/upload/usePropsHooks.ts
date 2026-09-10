import type { PropType } from 'vue'
export type UploadType = 'file' | 'image' | 'file-drag' | 'file-loading'
export const uploadProps = {
  hideImage: {
    type: Boolean,
    default: false,
  },
  theme: {
    type: String as PropType<UploadType>,
    default: 'file',
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  max: {
    type: Number,
    default: Infinity,
  },
  accept: {
    type: String,
    default: '.png,.jpg,.jpeg',
  },
  size: {
    type: Number,
  },
  requestMethod: {
    type: Function as PropType<(file: File) => Promise<any>>,
  },
  showTips: {
    type: Boolean,
    default: true,
  },
  tips: {
    type: String,
  },
  fileName: {
    type: String,
  },
  isXlsxMaxNumber: {
    type: Number,
    default: 0,
  },
  fileList: {
    type: Object as PropType<UploadFile[]>,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  isShowFileList: {
    type: Boolean,
    default: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  buttonText: {
    type: String,
    default: '点击上传附件',
  },
  buttonIcon: {
    type: String || undefined,
    default: undefined,
  },
  uploadPastedFiles: {
    type: Boolean,
    default: true,
  },
  zipMode: {
    type: Boolean,
    default: false,
  },
}
export type StatusType = 'success' | 'fail' | 'waiting'
export interface UploadFile {
  file: File
  status: StatusType
  percent: number
  name: string
  previewUrl: string
  fileUrl: string
  type?: string
  size: number
  date: string
  hideImage?: boolean
}
export interface UploadResponse {
  status: 'success' | 'fail'
  response?: {
    fileUrl: string
    fileName: string
    previewUrl: string
  }
}
