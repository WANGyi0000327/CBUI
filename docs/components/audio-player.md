---
title: CbAudioPlayer 音频播放器
---

<script setup>
import { ref } from 'vue'
</script>

# CbAudioPlayer 音频播放器

通用**音频播放器**组件（TDesign 生态）：播放/暂停、可拖拽进度条、倍速（0.5~2 倍）、音频下载（XMLHttpRequest 请求头下载）。内置**全局音频互斥管理**——同一时刻仅一个实例播放。支持两种样式（完整/精简），可作为独立组件使用，也是 **CbVoiceToText** 的内置播放器。

> 示例 `src` 已内置 18 秒可播放音频（`/demo-voice.wav`），点击播放可见时间走动与进度条推进。

## 基础用法

<DemoBlock>
  <CbAudioPlayer
    src="/demo-voice.wav"
  />

<template #code>

```vue
<template>
  <CbAudioPlayer src="/demo-voice.wav" />
</template>
```

</template>
</DemoBlock>

## 精简样式

`styletype="2"`：仅播放按钮 + 当前时间。

<DemoBlock>
  <CbAudioPlayer
    src="/demo-voice.wav"
    styletype="2"
  />

<template #code>

```vue
<template>
  <CbAudioPlayer src="/demo-voice.wav" styletype="2" />
</template>
```

</template>
</DemoBlock>

## 说明

- **全局互斥**：`useAudioManager` 管理所有实例，开始播放时自动暂停其他实例
- **倍速**：进度条右侧 0.5 / 1 / 1.5 / 2 倍速选择，监听自动生效
- **下载**：`downLoadXMLFile` 通过 XMLHttpRequest 携带请求头拉取 blob 后触发浏览器下载，失败时回退 `window.open` 直接打开
- **`audioId`**：多实例唯一标识，不传自动生成；配合互斥管理区分实例
- 事件参数均为**毫秒**（`timeupdate` / `durationchange`），进度展示换算为分:秒

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| src | 音频文件地址 | `string` | `-` |
| audioId | 音频唯一标识（多实例互斥管理） | `string` | `audio-{Date.now()}-{random}` |
| progressHeight | 进度条高度 | `string` | `'8px'` |
| IconSize | 播放/暂停图标尺寸 | `string` | `'32px'` |
| styletype | 样式类型：`'1'` 完整 / `'2'` 精简 | `string` | `'1'` |
| name | 名称（预留） | `string` | `'通话录音'` |

### Events

| 事件 | 说明 | 参数 |
| --- | --- | --- |
| timeupdate | 播放进度更新 | `time: number`（毫秒） |
| durationchange | 音频元数据加载完成 | `duration: number`（毫秒） |
| ended | 播放结束 | `-` |
| play | 开始播放 | `-` |
| pause | 暂停 | `-` |

### Expose

| 方法/属性 | 说明 |
| --- | --- |
| play | 播放 |
| pause | 暂停 |
| seekTo | 跳转到指定时间（毫秒） |
| togglePlay | 切换播放/暂停 |
| isPlaying | 是否播放中 |
| duration / durationDisplay / currentTimeDisplay | 时长（毫秒 / 显示文本） |
| playbackRate / setPlaybackRate | 倍速（0.5~4 有效） |
