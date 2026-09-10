---
title: CbUpload 上传
---

<script setup lang="ts">
import { ref } from 'vue'
const fileModel = ref('')
const fileModelMultiple = ref([])
const imgModel = ref('')
const dragModel = ref('')
// 模拟上传：返回成功响应（文档演示用，业务请传真实 requestMethod）
const mockUpload = (file: File) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        status: 'success',
        response: {
          fileUrl: URL.createObjectURL(file),
          fileName: file.name,
          previewUrl: URL.createObjectURL(file),
        },
      })
    }, 500)
  })
</script>

# CbUpload 上传

基于原生 input + 自研列表的上传组件，支持 `file`（按钮）、`file-drag`（拖拽）、`file-loading`（加载态）、`image`（图片）四种主题；内置 zip 解压（按 accept 展开，支持嵌套 zip）、xlsx 行数校验（`isXlsxMaxNumber`）、粘贴上传、外部回显等能力。上传请求通过 `requestMethod` 注入（组件库 shim 未实现真实上传，业务需传真实上传函数）。

## 文件上传（file）

点击按钮选择文件，上传中显示进度，成功后进入列表（可删除、可预览），文件通过 `v-model` 回传。

<DemoBlock>
  <CbUpload
    v-model="fileModel"
    theme="file"
    accept=".pdf,.docx,.xlsx,.zip"
    :request-method="mockUpload"
    tips="支持 pdf/docx/xlsx，可上传 zip 压缩包自动解压"
    style="width: 420px"
  />

<template #code>

```vue
<template>
  <CbUpload
    v-model="fileModel"
    theme="file"
    accept=".pdf,.docx,.xlsx,.zip"
    :request-method="mockUpload"
    tips="支持 pdf/docx/xlsx，可上传 zip 压缩包自动解压"
  />
</template>
```

</template>
</DemoBlock>

## 拖拽上传（file-drag）

拖拽文件到虚线区域即可上传，拖动时高亮提示。

<DemoBlock>
  <CbUpload
    v-model="dragModel"
    theme="file-drag"
    accept=".png,.jpg,.jpeg,.pdf"
    :request-method="mockUpload"
    tips="将文件拖到此处，或点击上传"
  />

<template #code>

```vue
<template>
  <CbUpload
    v-model="dragModel"
    theme="file-drag"
    accept=".png,.jpg,.jpeg,.pdf"
    :request-method="mockUpload"
    tips="将文件拖到此处，或点击上传"
  />
</template>
```

</template>
</DemoBlock>

## 图片上传（image）

图片主题以缩略图形式展示；`hideImage` 可隐藏缩略图；非多选时上传成功隐藏选择入口，多选时可连续添加（受 `max` 限制）。

<DemoBlock>
  <CbUpload
    v-model="imgModel"
    theme="image"
    accept=".png,.jpg,.jpeg"
    :request-method="mockUpload"
    tips="支持 png/jpg/jpeg"
  />

<template #code>

```vue
<template>
  <CbUpload
    v-model="imgModel"
    theme="image"
    accept=".png,.jpg,.jpeg"
    :request-method="mockUpload"
    tips="支持 png/jpg/jpeg"
  />
</template>
```

</template>
</DemoBlock>

## API

### Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| v-model | `string \| string[]` | `''` | 成功文件 URL（单文件 string，多文件 string[]） |
| v-model:detailfiles | `DetailFiles[]` | — | 成功文件明细（name/url/previewUrl/date/size/source） |
| v-model:loading | `boolean` | `false` | 是否有文件上传中 |
| theme | `'file' \| 'file-drag' \| 'file-loading' \| 'image'` | `'file'` | 主题 |
| multiple | `boolean` | `false` | 是否多选 |
| max | `number` | `Infinity` | 最大文件数（多选时） |
| accept | `string` | `'.png,.jpg,.jpeg'` | 接受的文件类型 |
| size | `number` | — | 单文件大小上限 MB（file 默认 10，其余 5） |
| requestMethod | `(file: File) => Promise<UploadResponse>` | — | 自定义上传函数（返回 `{ status, response: { fileUrl, previewUrl } }`） |
| showTips | `boolean` | `true` | 是否显示提示文案 |
| tips | `string` | — | 提示文案 |
| fileName | `string` | — | 文件名（file 主题） |
| isXlsxMaxNumber | `number` | `0` | xlsx 单次导入行数上限（0 不限制） |
| fileList | `UploadFile[]` | — | 外部文件列表（回显辅助） |
| disabled | `boolean` | `false` | 是否禁用 |
| isShowFileList | `boolean` | `true` | 是否展示文件列表 |
| buttonText | `string` | `'点击上传附件'` | 按钮文案 |
| buttonIcon | `string` | — | 按钮图标 |
| uploadPastedFiles | `boolean` | `true` | 是否支持粘贴上传 |
| zipMode | `boolean` | `false` | zip 模式：压缩包按 accept 解压展开 |

### Expose

| 方法 | 说明 |
| --- | --- |
| clearFiles | 清空文件列表与 detailfiles |
| getFiles | 获取当前 fileList |

### 说明

- 上传函数：组件库未实现真实上传（`serviceManager.getHttp().upload` 为可选占位），**必须传 `requestMethod`** 或业务覆盖 `#/config/api` 的 serviceManager。
- zip 模式使用自研 zip 中央目录解析（fflate 解压），支持 GBK/UTF-8 文件名、嵌套 zip（最多 5 层），自动跳过 `__MACOSX` / `.DS_Store`。
- 图片主题：PDF 文件显示内置 PDF 图标（CbPdfImg），点击放大走 `t-image-viewer`，点击文件名/图标可全屏预览。
- 粘贴上传：组件可见且鼠标悬停时，粘贴剪切板图片可直接上传。
