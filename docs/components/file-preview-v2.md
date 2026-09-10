---
title: CbFilePreviewV2 附件图片预览
---

<script setup>
import { ref } from 'vue'

// 基础用法：多图网格预览（图片模式默认开启）
const gridImages = ['/demo-img.jpg', '/demo-img.jpg', '/demo-img.jpg']
const gridDelIndex = ref(null)

// 单图模式：带 +N 角标
const singleImages = ['/demo-img.jpg', '/demo-img.jpg', '/demo-img.jpg']

// 附件模式：走 CbFilepreview 弹窗预览
const attachImages = [
  { url: '/demo.pdf', fileName: '采购合同.pdf' },
  { url: '/demo-img.jpg', fileName: '现场照片.jpg' },
  { url: '/demo.mp3', fileName: '通话录音.mp3' },
  { url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', fileName: '会议录像.mp4' },
]
</script>

# CbFilePreviewV2 附件图片预览

文件/图片预览组件 V2：**图片模式**基于 `t-image-viewer` 提供多图网格与单图角标（缩略图经 CbImageSecret 处理，hover 预览/删除，点击放大）；**附件模式**基于 CbFilepreview 弹窗预览 PDF/图片/音频/视频。支持自定义触发插槽与空态插槽。

## 基础用法

多图网格（`showOnlyImages` 默认开启）：hover 缩略图出现"预览 / 关闭"操作，点击预览打开大图弹层；关闭按钮触发 `deleteImage(index)`。

<DemoBlock>
  <div style="padding: 16px 0">
    <CbFilePreviewV2 :image-names="gridImages" @delete-image="(i) => (gridDelIndex = i)" />
    <p v-if="gridDelIndex !== null" style="margin-top: 12px; font-size: 13px; color: #666">
      已触发 deleteImage，index = {{ gridDelIndex }}
    </p>
  </div>

<template #code>

```vue
<template>
  <CbFilePreviewV2
    :image-names="images"
    @delete-image="(i) => console.log('删除第', i, '张')"
  />
</template>

<script setup lang="ts">
const images = ['/demo-img.jpg', '/demo-img.jpg', '/demo-img.jpg']
</script>
```

</template>
</DemoBlock>

## 单图模式

`single` 开启后仅渲染第一张，右下角显示 `+N` 总数角标；`width` / `height` 控制尺寸。

<DemoBlock>
  <div style="padding: 16px 0">
    <CbFilePreviewV2
      :image-names="singleImages"
      single
      width="96px"
      height="96px"
    />
  </div>

<template #code>

```vue
<template>
  <CbFilePreviewV2
    :image-names="images"
    single
    width="96px"
    height="96px"
  />
</template>

<script setup lang="ts">
const images = ['/demo-img.jpg', '/demo-img.jpg', '/demo-img.jpg']
</script>
```

</template>
</DemoBlock>

## 附件模式

`showOnlyImages=false` 时渲染附件入口（默认"附件 x N"，可用 `trigger` 插槽自定义），点击打开 CbFilepreview 弹窗按类型预览（PDF / 图片 / 音频 / 视频）。

<DemoBlock>
  <div style="padding: 16px 0">
    <CbFilePreviewV2 :image-names="attachImages" :show-only-images="false" />
  </div>

<template #code>

```vue
<template>
  <CbFilePreviewV2
    :image-names="files"
    :show-only-images="false"
  />
</template>

<script setup lang="ts">
const files = [
  { url: '/demo.pdf', fileName: '采购合同.pdf' },
  { url: '/demo-img.jpg', fileName: '现场照片.jpg' },
  { url: '/demo.mp3', fileName: '通话录音.mp3' },
  { url: 'https://example.com/video.mp4', fileName: '会议录像.mp4' },
]
</script>
```

</template>
</DemoBlock>

## 自定义触发与空态

附件模式支持 `trigger` 插槽自定义入口；无图片时可用 `empty` 插槽替换默认 `t-empty`。

<DemoBlock>
  <div style="padding: 16px 0">
    <CbFilePreviewV2 :image-names="attachImages" :show-only-images="false">
      <template #trigger>
        <t-button variant="outline" size="small">查看附件</t-button>
      </template>
    </CbFilePreviewV2>
    <div style="margin-top: 16px">
      <CbFilePreviewV2 :image-names="[]">
        <template #empty>
          <p style="color: #999; font-size: 13px">暂无附件</p>
        </template>
      </CbFilePreviewV2>
    </div>
  </div>

<template #code>

```vue
<template>
  <CbFilePreviewV2 :image-names="files" :show-only-images="false">
    <template #trigger>
      <t-button variant="outline" size="small">查看附件</t-button>
    </template>
  </CbFilePreviewV2>
</template>
```

</template>
</DemoBlock>

## API

### Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| imageNames | `string[]` | — | 必填。图片模式下为图片路径/名称数组；附件模式下为 `{ url, fileName }` 数组 |
| showOnlyImages | `boolean` | `true` | true=图片网格预览（t-image-viewer）；false=附件模式（CbFilepreview 弹窗） |
| single | `boolean` | `false` | 单图模式，仅渲染第一张并显示 `+N` 角标 |
| width | `string` | `'56px'` | 单图宽度 |
| height | `string` | `'56px'` | 单图高度 |
| isShowDeleteIcon | `boolean` | `false` | 是否显示删除图标（预留） |

### Events

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| deleteImage | `index: number` | 点击缩略图关闭按钮触发，传图片下标 |

### Slots

| 插槽名 | 说明 |
| --- | --- |
| trigger | 附件模式自定义触发入口 |
| empty | 无图片时的空态内容（默认 `t-empty`） |

### 说明

- 图片缩略图由内部 CbImageSecret 渲染：http(s) 链接直接展示，业务路径经 `#/config/api` 的 `serviceManager.getHttp().getFileTempUrl()` 换取临时 URL（组件库内置 shim 直接回传原路径，业务方可覆盖）。
- 附件模式内部复用 CbFilepreview，按 URL 后缀识别 mp3/mp4/pdf/png/jpg/jpeg/html，其余类型提示暂不支持预览。
- 点击缩略图打开大图时，先经 getImageUrl 换取临时 URL 再打开弹层。
