<template>
  <div class="custom-upload-file" tabindex="0" style="outline: none">
    <div class="custom-upload-content">
      <div class="custom-upload-trigger" :class="{ 'custom-upload-drag': theme === 'file-drag' }">
        <template v-if="theme === 'file-drag'">
          <div
            :class="{ 'is-dragover': isDragging }"
            @dragover.prevent="handleDragOver"
            @dragleave.prevent="handleDragLeave"
            @drop.prevent="handleDrop"
          >
            <div class="custom-upload-trigger">
              <div class="custom-upload-icon">
                <cb-icon name="xiazai" size="45px" color="var(--td-brand-color)"></cb-icon>
              </div>
              <div>
                {{ isDragging ? '松开上传文件' : '点击或将文件拖拽到这里上传' }}
              </div>
              <div v-if="showTips" class="tips">
                {{ tips }}
              </div>
              <input
                id="file"
                ref="inputFileRef"
                type="file"
                :multiple="multiple"
                :accept="effectiveAccept"
                name="file"
                @change="handleFilesChange"
              />
            </div>
          </div>
        </template>
        <template v-else-if="theme === 'file-loading'">
          <t-button
            theme="default"
            :loading="loading"
            :icon="buttonIcon"
            @click="triggerSelectFile"
            >{{ buttonText }}</t-button
          >
          <input
            id="file"
            ref="inputFileRef"
            type="file"
            :multiple="multiple"
            :accept="effectiveAccept"
            name="file"
            style="display: none"
            class="cursor-pointer"
            @change="handleFilesChange"
          />
          <div v-if="showTips" class="custom-upload-tips">
            {{ tips }}
          </div>
        </template>
        <template v-else>
          <t-button @click="triggerSelectFile">{{ buttonText }}</t-button>
          <input
            id="file"
            ref="inputFileRef"
            type="file"
            :multiple="multiple"
            :accept="effectiveAccept"
            name="file"
            style="display: none"
            class="cursor-pointer"
            @change="handleFilesChange"
          />
          <div v-if="showTips" class="custom-upload-tips">
            {{ tips }}
          </div>
        </template>
      </div>
    </div>
    <template v-if="fileList?.length && theme !== 'file-loading'">
      <div class="custom-upload-file-list">
        <template v-for="(item, idx) in fileList" :key="item.name + idx">
          <div class="custom-upload-file-list-item" :class="item.status">
            <CbFilePreviewV2 :image-names="[{ url: item.previewUrl }]" :show-only-images="false">
              <template #trigger>
                <div class="custom-upload-file-list-item_name" :title="item.name">
                  <cb-icon name="fujian" />
                  {{ getFileNameFromUrl(item.name) }}
                </div>
              </template>
            </CbFilePreviewV2>
            <div class="custom-upload-file-operation">
              <template v-if="item.status === 'fail'">
                <cb-icon name="chongxin" size="16px" @click="handleFileReUpload(idx)" />
                <cb-icon name="shanchu" size="16px" @click="handleFileDel(idx)" />
              </template>
              <template v-if="item.status === 'success'">
                <cb-icon name="shanchu" size="16px" @click="handleFileDel(idx)" />
              </template>
              <template v-if="item.status === 'waiting'">
                <t-loading color="var(--td-brand-color)" size="16px" />
                {{ item.percent }}%
              </template>
            </div>
          </div>
        </template>
      </div>
    </template>
  </div>
</template>
<script lang="ts" setup>
import { ref, computed } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'
import CbFilePreviewV2 from '#/file-preview-v2/FilePreviewV2.vue'
import { uploadProps } from '../usePropsHooks'
import { EXTENSION_ALIASES, MIME_TYPE_MAP } from '../config'
const props = defineProps(uploadProps)
const emits = defineEmits(['delete', 're-upload', 'upload'])
const isDragging = ref(false)
const effectiveAccept = computed(() => (props.zipMode ? `${props.accept},.zip` : props.accept))
const handleDragOver = () => {
  isDragging.value = true
}
const handleDragLeave = () => {
  isDragging.value = false
}
function getFileNameFromUrl(url: string) {
  if (!url || typeof url !== 'string') {
    return ''
  }
  // 1. 移除URL中的查询参数（问号及之后的部分）
  const urlWithoutQuery = url.split('?')[0]
  // 2. 移除URL中的哈希部分（#及之后的部分）
  const urlWithoutHash = urlWithoutQuery?.split('#')[0]
  // 3. 获取最后一个斜杠后的部分
  const parts = urlWithoutHash?.split('/')
  const fileName = parts ? parts[parts.length - 1] : ''
  // 4. 验证文件名是否有效（不包含特殊字符，有扩展名等）
  // fileName.includes('..') || fileName.includes('//')
  if (!fileName) {
    return ''
  }
  return fileName || ''
}
const triggerSelectFile = () => {
  inputFileRef.value?.click()
}
const validateFiles = (files: File[]): boolean => {
  if (files.length === 0) return false
  if (!props.multiple && files.length > 1) {
    MessagePlugin.warning('仅支持单文件上传')
    return false
  }
  const acceptList = effectiveAccept.value
    .toLowerCase()
    .split(',')
    .map((s) => s.trim())
  const allValid = files.every((file) => {
    const fileExt = `.${file.name.split('.').pop()?.toLowerCase()}`
    const mimeExt = MIME_TYPE_MAP[file.type] || ''
    return acceptList.some((acceptedItem) => {
      const validExtensions = EXTENSION_ALIASES[acceptedItem] || [acceptedItem]
      return validExtensions.includes(fileExt) || validExtensions.includes(mimeExt)
    })
  })
  if (!allValid) {
    MessagePlugin.warning(`仅支持上传 ${props.accept}`)
    clearFiles()
    return false
  }
  return true
}
const handleDrop = (e: DragEvent) => {
  isDragging.value = false
  const files = e.dataTransfer?.files ? Array.from(e.dataTransfer.files) : []
  if (validateFiles(files)) {
    if (inputFileRef.value) {
      const dataTransfer = new DataTransfer()
      files.map((file) => dataTransfer.items.add(file))
      inputFileRef.value.files = dataTransfer.files
      const event = new Event('change', { bubbles: true })
      inputFileRef.value.dispatchEvent(event)
    }
  }
}
const inputFileRef = ref()
const clearFiles = () => {
  if (!inputFileRef.value) return
  inputFileRef.value.value = ''
}
const handleFilesChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  const files = target.files ? Array.from(target.files) : []
  const accept = effectiveAccept.value.split(',') || []
  for (let i = 0; i < files.length; i++) {
    const nameExt = `.${files[i]?.name.split('.').pop()?.toLowerCase()}`
    if (props.zipMode && nameExt === '.zip') continue
    const extension = '.' + files[i]?.type?.split('/').pop()
    //用于判断xlsx格式上传
    const isFileType =
      extension === '.vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      extension === '.vnd.ms-excel'
        ? '.xlsx'
        : extension
    //用于判断docx格式上传
    const isFileType2 =
      isFileType === '.vnd.openxmlformats-officedocument.wordprocessingml.document'
        ? '.docx'
        : isFileType
    if (accept.indexOf(isFileType2) === -1) {
      MessagePlugin.warning(`仅支持上传${props.accept}`)
      clearFiles()
      return
    }
  }
  emits('upload', e)
}
const handleFileDel = (idx: number) => {
  emits('delete', idx)
}
const handleFileReUpload = (idx: number) => {
  emits('re-upload', idx)
}
const handleExternalFiles = (files: File[]) => {
  if (files.length === 0) return
  if (!validateFiles(files)) return
  const accept = effectiveAccept.value.split(',') || []
  for (let i = 0; i < files.length; i++) {
    const extension = '.' + files[i]?.name.split('.').pop()?.toLowerCase()
    const isFileType =
      files[i]?.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      files[i]?.type === 'application/vnd.ms-excel'
        ? '.xlsx'
        : extension
    const isFileType2 =
      isFileType === '.vnd.openxmlformats-officedocument.wordprocessingml.document'
        ? '.docx'
        : isFileType
    if (accept.indexOf(isFileType2) === -1) {
      MessagePlugin.warning(`仅支持上传${props.accept}`)
      clearFiles()
      return
    }
  }
  const e = {
    target: {
      files: files,
    },
  } as unknown as Event
  emits('upload', e)
}
defineExpose({
  clearFiles,
  handleExternalFiles,
})
</script>
<style scoped lang="scss">
.custom-upload-file {
  .custom-upload-content {
    display: flex;
    align-items: end;
    gap: 8px;
    width: 100%;
    .custom-upload-trigger {
      cursor: pointer;
      position: relative;
      .t-button {
        background-color: var(--td-brand-color-10);
        font-size: 14px;
        color: var(--td-brand-color);
      }
      input {
        position: absolute;
        width: 100%;
        height: 100%;
        cursor: pointer;
        opacity: 0;
        top: 0;
        left: 0;
      }
      &.custom-upload-drag {
        width: 100%;
        height: 200px;
        background-color: #fbfbfb;
        border: 1px dashed #d9d9d9;
        > div {
          width: 100%;
          height: 100%;
        }
        .custom-upload-trigger {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: var(--td-text-color-6);
          .custom-upload-icon {
            margin-bottom: 16px;
          }
          .tips {
            max-width: 60%;
            text-align: center;
            font-size: 12px;
            color: var(--td-text-color-9);
            margin-top: 7px;
          }
          input {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
    .custom-upload-tips {
      font-size: 12px;
      margin-top: 10px;
      color: var(--td-color-gray-c);
    }
  }
  .custom-upload-file-list {
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    .custom-upload-file-list-item {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      color: var(--td-text-color-6);
      gap: 8px;
      .custom-upload-file-list-item_name {
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        flex-grow: 1;
      }
      .custom-upload-file-operation {
        flex-shrink: 0;
        display: flex;
        align-items: center;
        gap: 5px;
        .svg-icon {
          cursor: pointer;
        }
      }
      &.fail {
        color: var(--td-color-danger);
      }
      &:hover {
        color: var(--td-brand-color);
      }
    }
  }
}
</style>
