---
title: CbVideoPlayer 视频播放器
---

# CbVideoPlayer 视频播放器

基于 HTML5 `<video>` 的视频播放组件，`src` 传入视频地址；容器宽度自适应（大屏 1280px、窄屏 640px），居中播放。常用于文件预览（CbFilepreview 的视频类型预览）。

## 基础用法

传入视频地址即可播放（请替换为真实视频 URL）。

<DemoBlock>
  <div style="padding: 8px; border: 1px dashed #d9d9d9">
    <CbVideoPlayer src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" />
  </div>

<template #code>

```vue
<template>
  <CbVideoPlayer src="https://example.com/video.mp4" />
</template>
```

</template>
</DemoBlock>

## API

### Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| src | `string` | `''` | 视频地址（必传） |

### 说明

- 容器宽度根据 `useWindowSize` 自适应：屏幕 < 1880px 时 640×360，否则 1280×720。
- 支持浏览器原生控件播放（controls）。
