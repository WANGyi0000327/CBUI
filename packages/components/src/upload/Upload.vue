<template>
  <div ref="customUploadRef" class="custom-upload">
    <File
      v-if="theme === 'file' || theme === 'file-drag' || theme === 'file-loading'"
      ref="uploadFileRef"
      :theme="theme"
      :multiple="multiple"
      :accept="accept"
      :show-tips="showTips"
      :tips="tips"
      :loading="loading"
      :file-list="fileList"
      :file-name="fileName"
      :button-text="buttonText"
      :button-icon="buttonIcon"
      :zip-mode="zipMode"
      @delete="handleFileDel"
      @re-upload="handleFileReUpload"
      @upload="handleFilesChange"
    />
    <Image
      v-if="theme === 'image'"
      ref="uploadImageRef"
      :theme="theme"
      v-bind="$attrs"
      :multiple="multiple"
      :accept="accept"
      :show-tips="showTips"
      :hide-image="hideImage"
      :tips="tips"
      :file-list="fileList"
      :max="max"
      @delete="handleFileDel"
      @re-upload="handleFileReUpload"
      @upload="handleFilesChange"
    />
  </div>
</template>
<script lang="ts" setup>
import { ref, watch, computed } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'
import type { UploadFile, UploadResponse } from './usePropsHooks'
import File from './components/File.vue'
import Image from './components/Image.vue'
import { serviceManager } from '#/config/api'
import { countExcelData } from './hook'
import { uploadProps } from './usePropsHooks'
import { isZipFile, unZipByAccept } from './utils/index'
import dayjs from 'dayjs'
import { useElementVisibility, useEventListener, useElementHover } from '@vueuse/core'
defineOptions({
  name: 'CbUpload',
})
interface DetailFiles {
  name: string
  url: string
  previewUrl: string
  source: string
  date: string
  size: number
}
const props = defineProps(uploadProps)
const actualSize = computed(() => (props.size ? props.size : props.theme === 'file' ? 10 : 5))
const maxSize = computed(() => {
  return actualSize.value * 1024 * 1024
})
const customUploadRef = ref<HTMLElement | null>(null)
const isVisible = useElementVisibility(customUploadRef)
const isHovered = useElementHover(customUploadRef)
const modelValue = defineModel<string[] | string>()
const detailfiles = defineModel<DetailFiles[]>('detailfiles')
const loading = defineModel<boolean>('loading')
const fileList = ref<UploadFile[]>([])
const upload = (props.requestMethod || serviceManager?.getHttp().upload || (() => {})) as (
  file: File
) => Promise<any>
const uploadFileRef = ref()
const uploadImageRef = ref()
const handleFilesChange = async (e: Event) => {
  const target = e.target as HTMLInputElement
  const picked = target.files ? Array.from(target.files) : []
  // 立即清空原生 input，避免异步解压期间用户重复触发
  clearInputFiles()
  // zip 模式：把压缩包按 accept 展开成普通文件
  let files = picked
  if (props.zipMode) {
    try {
      const expanded: File[] = []
      for (const f of picked) {
        if (isZipFile(f)) {
          expanded.push(...(await unZipByAccept(f, props.accept)))
        } else {
          expanded.push(f)
        }
      }
      files = expanded
    } catch (err) {
      console.error('压缩包解压失败', err)
      MessagePlugin.warning('压缩包解压失败，请检查文件')
      return
    }
    // 压缩包内未找到符合 accept 的文件
    if (picked.some(isZipFile) && files.length === 0) {
      MessagePlugin.warning('压缩包内未找到符合要求的文件')
      return
    }
  }
  const currentLen = fileList.value.length + files.length
  console.log(props.max, 'props.max', props.multiple, currentLen)
  if (props.max && props.multiple && currentLen > props.max) {
    MessagePlugin.warning(`只能选择${props.max}个文件`)
    return
  }
  for (let i = 0; i < files.length; i++) {
    if (files[i]!.size > maxSize.value) {
      MessagePlugin.warning(`文件大小不能超过${actualSize.value}MB`)
      return
    } else if (files[i]!.size === 0) {
      MessagePlugin.warning(`文件大小不能为空`)
      return
    }
  }
  //用于判断xlsx上传的文件数量
  if (props.isXlsxMaxNumber) {
    const { totalData: xlsxLength } = await countExcelData(files?.[0])
    if (xlsxLength && Number(xlsxLength) - 1 > props.isXlsxMaxNumber) {
      MessagePlugin.warning(`单次导入不能超过${props.isXlsxMaxNumber}条`)
      return
    }
  }
  const uploadFiles = files.map((item) => {
    return {
      file: item,
      status: 'waiting',
      name: item.name,
      size: item.size,
      date: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      percent: 0,
      previewUrl: URL.createObjectURL(item),
    }
  }) as UploadFile[]
  handleUploadFile(uploadFiles)
}
const handleUploadFile = (files: UploadFile[]) => {
  let startIdx = fileList.value.length
  if ((props.theme === 'file' || props.theme === 'file-loading') && !props.multiple) {
    fileList.value = [...files]
    startIdx = 0
  } else {
    fileList.value = [...fileList.value, ...files]
  }
  for (let i = startIdx; i < fileList.value.length; i++) {
    uploadFile(fileList.value[i]!)
  }
}
const uploadFile = (file: UploadFile) => {
  if (!file) return
  file.status = 'waiting'
  file.percent = 0
  const process = setInterval(() => {
    const percent = file.percent + 10
    if (percent >= 100) {
      file.percent = 99
      clearInterval(process)
    } else {
      file.percent = percent
    }
  }, 200)
  upload(file.file)
    .then((res: UploadResponse) => {
      clearInterval(process)
      file.percent = 100
      file.status = res.status
      if (res?.response) {
        file.fileUrl = res.response?.fileUrl
        file.previewUrl = res.response?.previewUrl
      }
    })
    .catch(() => {
      file.status = 'fail'
    })
}
const handleFileDel = (idx: number) => {
  fileList.value.splice(idx, 1)
}
const handleFileReUpload = (idx: number) => {
  uploadFile(fileList.value[idx]!)
}
const clearInputFiles = () => {
  uploadFileRef.value?.clearFiles()
  uploadImageRef.value?.clearFiles()
}
const clearFiles = () => {
  fileList.value = []
  detailfiles.value = []
  clearInputFiles()
}
defineExpose({ clearFiles, getFiles: () => fileList.value })
// 提取 fileList 中成功文件的 URL 字符串（用于对比，避开引用地址问题）
const getFileListUrls = (list: UploadFile[]) => {
  return list
    .filter((item) => item.status === 'success' && item.fileUrl)
    .map((item) => item.fileUrl)
    .join(',')
}
// 提取外部传入值的 URL 字符串
const getExternalUrls = (val: string | string[] | undefined) => {
  if (!val) return ''
  return Array.isArray(val) ? val.join(',') : val
}
// 同步 fileList -> 外部 modelValue (内部改变驱动)
watch(
  () => fileList.value,
  (newList) => {
    const successFiles = newList.filter((item) => item.status === 'success')
    const currentSuccessUrls = getFileListUrls(newList)
    const externalUrls = getExternalUrls(modelValue.value)
    // 1. 只有当成功的文件 URL 列表与外部不一致时，才更新 modelValue
    if (currentSuccessUrls !== externalUrls) {
      if (!props.multiple) {
        modelValue.value = successFiles[0]?.fileUrl || ''
      } else {
        modelValue.value = successFiles.map((item) => item.fileUrl!)
      }
      // 同步更新 detailfiles
      const nextDetail = successFiles.map((item) => ({
        name: item.name,
        url: item.fileUrl!,
        previewUrl: item.previewUrl,
        date: item.date,
        size: item.size,
        source: '上传',
      }))
      // 同样需要判断 detailfiles 内容是否真的变了，防止递归
      if (JSON.stringify(nextDetail) !== JSON.stringify(detailfiles.value)) {
        detailfiles.value = nextDetail
      }
    }
    // 2. 更新 loading 状态
    const isNowLoading = !!newList.find((item) => item.status === 'waiting')
    if (loading.value !== isNowLoading) {
      loading.value = isNowLoading
    }
  },
  { deep: true }
)
// 同步 外部 modelValue -> fileList (外部改变驱动，如重置、回显)
watch(
  () => ({
    mv: modelValue.value,
    df: detailfiles.value,
  }),
  ({ mv, df }) => {
    const externalUrls = getExternalUrls(mv)
    const internalUrls = getFileListUrls(fileList.value)
    // 如果外部值和当前内部成功列表一致，或者内部正在上传中，则不处理回显
    // 内部更新 -> 外部变 -> 外部变重新刷掉内部正在上传的文件
    const isUploading = fileList.value.some((f) => f.status === 'waiting')
    if (externalUrls === internalUrls || isUploading) return
    let filesToProcess: Partial<DetailFiles>[] = []
    if (df && df.length) {
      filesToProcess = df.map((item) => ({
        ...item,
      }))
    } else if (mv) {
      const urls = Array.isArray(mv) ? mv : [mv]
      filesToProcess = urls.map((url) => ({
        name: url.split('/').pop() || 'file',
        url,
        previewUrl: url,
      }))
    }
    if (filesToProcess.length === 0) {
      if (fileList.value.length > 0) fileList.value = []
      return
    }
    // 更新内部列表
    fileList.value = filesToProcess.map((item) => ({
      ...item,
      previewUrl: item?.previewUrl || item.url,
      status: 'success',
      fileUrl: item.url,
      percent: 100,
    })) as UploadFile[]
  },
  { immediate: true, deep: true }
)
useEventListener(document, 'paste', (event: ClipboardEvent) => {
  if (!isVisible.value || !isHovered.value) return
  const target = event.target as HTMLElement
  if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
    return
  }
  const clipboardFiles = event.clipboardData?.files
  if (clipboardFiles && clipboardFiles.length > 0) {
    event.preventDefault()
    const files = Array.from(clipboardFiles)
    if (props.theme === 'image') {
      uploadImageRef.value?.handleExternalFiles?.(files)
    } else {
      uploadFileRef.value?.handleExternalFiles?.(files)
    }
  }
})
</script>
