---
title: CbFilepreview 文件预览
---

<script setup>
import { ref } from 'vue'

const imgVisible = ref(false)
const imgRef = ref()
const imgFiles = [{ url: '/demo-img.jpg', fileName: '示例图片.jpg' }]

const multiVisible = ref(false)
const multiRef = ref()
const multiFiles = [
  { url: '/demo.pdf', fileName: '采购合同.pdf' },
  { url: '/demo-img.jpg', fileName: '现场照片.jpg' },
  { url: '/demo.mp3', fileName: '通话录音.mp3' },
  {
    url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    fileName: '会议录像.mp4',
  },
]

const dlVisible = ref(false)
const dlRef = ref()
const dlFiles = [{ url: 'https://example.com/readme.txt', fileName: '说明.txt' }]
</script>

# CbFilepreview 文件预览

基于 TDesign Dialog 的文件预览组件：通过文件 URL 自动识别类型，支持 **PDF（pdfjs 渲染）/ 图片（旋转缩放拖拽）/ 音频 / 视频 / 不支持类型下载**，多文件时提供标签切换。

## 基础用法

`v-model:dialogVisible` 控制弹窗显隐，`fileList` 传入文件列表；通过组件 ref 调用 `open()` 打开预览。

<DemoBlock>
  <div style="height: 420px">
    <CbFilepreview
      ref="multiRef"
      v-model:dialogVisible="multiVisible"
      :file-list="multiFiles"
    />
    <t-button @click="multiRef?.open()">打开文件预览</t-button>
    <p style="margin-top: 12px; font-size: 13px; color: #666;">
      多文件场景：左侧标签区 + 切换预览（PDF / 图片 / 音频 / 视频四种类型）
    </p>
  </div>

<template #code>

```vue
<template>
  <div>
    <t-button @click="previewRef?.open()">打开文件预览</t-button>
    <CbFilepreview
      ref="previewRef"
      v-model:dialogVisible="visible"
      :file-list="files"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { CbFilepreview } from '@cb-ui/components'
const visible = ref(false)
const previewRef = ref()
const files = [
  { url: 'https://example.com/contract.pdf', fileName: '采购合同.pdf' },
  { url: 'https://example.com/photo.jpg', fileName: '现场照片.jpg' },
  { url: 'https://example.com/record.mp3', fileName: '通话录音.mp3' },
  { url: 'https://example.com/video.mp4', fileName: '会议录像.mp4' },
]
</script>
```

</template>
</DemoBlock>

## 图片预览

支持左转 / 右转 / 放大 / 缩小，鼠标滚轮缩放、按住拖拽图片（最大 5 倍、最小 0.1 倍）。

<DemoBlock>
  <div style="height: 420px">
    <CbFilepreview
      ref="imgRef"
      v-model:dialogVisible="imgVisible"
      :file-list="imgFiles"
    />
    <t-button @click="imgRef?.open()">预览图片</t-button>
    <span style="color: #999; font-size: 12px; margin-left: 8px">
      打开后可旋转 / 缩放 / 拖拽
    </span>
  </div>

<template #code>

```vue
<template>
  <div style="height: 420px">
    <CbFilepreview
      ref="imgRef"
      v-model:dialogVisible="visible"
      :file-list="files"
    />
    <t-button @click="imgRef?.open()">预览图片</t-button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { CbFilepreview } from '@cb-ui/components'
const visible = ref(false)
const imgRef = ref()
const files = [{ url: 'https://example.com/photo.jpg', fileName: '照片.jpg' }]
</script>
```

</template>
</DemoBlock>

## 不支持的类型下载

无法在线预览的类型（如 txt）显示"暂不支持在线预览"提示与下载按钮，点击调用 `downloadFileBySaveAs` 另存为下载。

<DemoBlock>
  <div style="height: 420px">
    <CbFilepreview
      ref="dlRef"
      v-model:dialogVisible="dlVisible"
      :file-list="dlFiles"
    />
    <t-button @click="dlRef?.open()">预览 txt</t-button>
  </div>

<template #code>

```vue
<template>
  <div style="height: 420px">
    <CbFilepreview
      ref="previewRef"
      v-model:dialogVisible="visible"
      :file-list="files"
    />
    <t-button @click="previewRef?.open()">预览 txt</t-button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { CbFilepreview } from '@cb-ui/components'
const visible = ref(false)
const previewRef = ref()
const files = [{ url: 'https://example.com/readme.txt', fileName: '说明.txt' }]
</script>
```

</template>
</DemoBlock>

## PDF / 音频 / 视频

- **PDF**：`CbPdfViewer` 基于 pdfjs-dist 渲染，左侧缩略图、页码显示、放大 / 缩小 / 旋转 / 重置、滚动联动当前页。
- **音频**：`CbAudio` 内嵌 `CbAudioPlayer`，响应式宽度（<1880px 显示 640px 宽度）。
- **视频**：`CbVideo` 内嵌 `CbVideoPlayer`（原生 video + 播放/暂停/进度），响应式尺寸（<1880px 显示 640×360）。

> 说明：PDF / 音频 / 视频 demo 需真实可访问的文件地址，文档页不内置示例资源；将 `fileList` 的 url 替换为实际地址即可预览。

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| fileList | `FileItem[]` | `[]` | 文件列表，`FileItem = { url, name?, fileName?, profitImg? }` |
| nowUrl | `string` | `''` | 打开时指定预览的 url（缺省取 fileList[0]） |
| nowname | `string` | `''` | 打开时指定文件名 |
| fileName | `string` | `''` | 预览标题（缺省取 fileList[0].fileName） |

## v-model

| 名称 | 类型 | 说明 |
| --- | --- | --- |
| dialogVisible | `boolean` | 弹窗显隐双向绑定 |

## Expose

| 方法 | 说明 |
| --- | --- |
| open() | 打开预览（以 nowUrl 或 fileList[0] 初始化） |

## 支持的文件类型

| 后缀 | 预览方式 |
| --- | --- |
| `mp3` | 音频播放器 |
| `mp4` | 视频播放器 |
| `pdf` | PDF 查看器（pdfjs） |
| `png / jpg / jpeg` | 图片查看器（旋转/缩放/拖拽） |
| `html`（含 url 带 `urlId=`） | 标注为 html 类型 |
| 其他 | 暂不支持提示 + 下载按钮 |
