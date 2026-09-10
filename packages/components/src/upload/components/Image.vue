<template>
  <div class="custom-upload">
    <template v-for="(item, idx) in fileList" :key="item.name + idx">
      <div
        class="custom-upload-preview custom-upload-success"
        v-if="item.status === 'success' && !props.hideImage"
      >
        <!-- <img :src="item.previewUrl" /> -->
        <template v-if="isPdfFile(item.name)">
          <CbPdfImg />
        </template>
        <template v-else>
          <cb-image-secret :temp-url="item.previewUrl" class="w-full h-full" />
        </template>
        <div class="custom-upload-operation">
          <div class="close">
            <cb-icon
              color="#fff"
              name="guanbi"
              size="14px"
              @click="handleFileDel(idx)"
            />
          </div>
          <t-image-viewer v-model:visible="visible" :images="previewImg">
            <template #trigger>
              <cb-icon
                name="fangda"
                color="#fff"
                size="18px"
                @click="handleOpenPreview(item.previewUrl, item.name!)"
              />
            </template>
          </t-image-viewer>
        </div>
      </div>
      <div
        class="custom-upload-preview custom-upload-fail"
        v-if="item.status === 'fail'"
      >
        <cb-icon size="20px" name="cuowu" color="var(--td-color-danger)" />
        <p>上传错误</p>
        <div class="custom-upload-operation">
          <div class="close">
            <cb-icon
              color="#fff"
              name="guanbi"
              size="14px"
              @click="handleFileDel(idx)"
            />
          </div>
          <cb-icon
            name="chongxin"
            color="#fff"
            size="16px"
            @click="handleFileReUpload(idx)"
          />
        </div>
      </div>
      <div
        class="custom-upload-preview custom-upload-waiting"
        v-if="item.status === 'waiting'"
      >
        <t-loading size="20px" color="var(--td-brand-color)" />
        <p>上传中 {{ item.percent }}%</p>
      </div>
    </template>
    <div class="custom-upload-trigger" v-if="showUploadTrigger">
      <cb-icon name="tianjiatupian" />
      <p>上传图片</p>
      <input
        type="file"
        ref="inputFileRef"
        id="file"
        :multiple="multiple"
        :accept="accept"
        name="file"
        @change="handleFilesChange"
      />
    </div>
    <div class="custom-upload-tips" v-if="showTips">{{ tips }}</div>
    <CbFilepreview
      v-model:dialogVisible="dialogVisible"
      :fileList="previewImages"
    ></CbFilepreview>
  </div>
</template>
<script lang="ts" setup>
import { computed, ref } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'
import { uploadProps } from '../usePropsHooks'
import CbPdfImg from './PdfImg.vue'
const props = defineProps(uploadProps)
const visible = ref(false)
const previewImg = ref<string[]>()
const dialogVisible = ref(false)
const previewImages = ref<{ url: string }[]>([])
const handleOpenPreview = (img: string, name: string) => {
  console.log(img, 'handleOpenPreview')
  if (isPdfFile(name)) {
    previewImages.value = [{ url: img }]
    dialogVisible.value = true
    return
  }
  previewImg.value = [img]
  visible.value = true
}
const isPdfFile = (filename: string | undefined) =>
  typeof filename === 'string' && filename.toLowerCase().endsWith('.pdf')
const showUploadTrigger = computed(
  () =>
    (!props.multiple && props.fileList?.length === 0) ||
    (props.multiple && props.fileList!.length < props.max)
)
const inputFileRef = ref()
const clearFiles = () => {
  if (!inputFileRef.value) return
  inputFileRef.value.value = ''
}
const emits = defineEmits(['delete', 're-upload', 'upload'])
const handleFilesChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  const files = target.files ? Array.from(target.files) : []
  const accept = props.accept.split(',') || []
  for (let i = 0; i < files.length; i++) {
    const extension = '.' + files[i]?.type?.split('/').pop()
    if (accept.indexOf(extension) === -1) {
      MessagePlugin.warning(`仅支持上传${props.accept}`)
      clearFiles()
      return
    }
  }
  emits('upload', e)
}
const handleExternalFiles = (files: File[]) => {
  if (files.length === 0) return
  const currentLen = (props.fileList?.length || 0) + files.length
  if (props.max && props.multiple && currentLen > props.max) {
    MessagePlugin.warning(`只能选择${props.max}张图片`)
    return
  }
  const accept = props.accept.split(',') || []
  for (let i = 0; i < files.length; i++) {
    const extension = '.' + files[i]?.type?.split('/').pop()
    if (accept.indexOf(extension) === -1) {
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
const handleFileDel = (idx: number) => {
  emits('delete', idx)
}
const handleFileReUpload = (idx: number) => {
  emits('re-upload', idx)
}
defineExpose({
  clearFiles,
  handleExternalFiles,
})
</script>
<style scoped lang="scss">
.custom-upload {
  display: flex;
  align-items: end;
  flex-wrap: wrap;
  gap: 10px;
  .custom-upload-pdf {
    border: 1px solid #cca47a !important;
  }
  .custom-upload-trigger {
    width: 96px;
    height: 96px;
    border: 1px dashed var(--td-border-color-1);
    border-radius: 2px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 12px;
    gap: 8px;
    position: relative;
    .svg-icon {
      font-size: 20px;
      color: var(--td-brand-color);
    }
    input {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      cursor: pointer;
      opacity: 0;
      z-index: 9;
    }
  }
  .custom-upload-preview {
    width: 96px;
    height: 96px;
    cursor: pointer;
    border: 1px dashed var(--td-border-color-1);
    border-radius: 2px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    gap: 5px;
    font-size: 12px;
    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
    &:hover {
      .custom-upload-operation {
        display: flex;
      }
    }
    .custom-upload-operation {
      position: absolute;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.6);
      display: none;
      align-items: center;
      justify-content: center;
      .close {
        position: absolute;
        top: 0;
        right: 0;
        width: 20px;
        height: 20px;
        text-align: center;
        line-height: 20px;
        background-color: rgba(0, 0, 0, 0.4);
      }
    }
  }
  .custom-upload-tips {
    font-size: 12px;
    color: var(--td-color-gray-c);
  }
}
</style>
