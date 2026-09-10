---
title: CbVoiceToText 音频转文字
---

<script setup>
import { ref } from 'vue'

const transcripts = [
  {
    BeginTime: 0,
    EndTime: 4200,
    Text: '您好，欢迎致电，请问有什么可以帮您？',
    SpeakerId: '0',
  },
  {
    BeginTime: 4200,
    EndTime: 9800,
    Text: '我想了解一下最近的活动优惠。',
    SpeakerId: '1',
  },
  {
    BeginTime: 9800,
    EndTime: 15000,
    Text: '好的，目前我们有新人立减和充值满赠活动，详情如下。',
    SpeakerId: '0',
  },
]
const audioSrc = '/demo-voice.wav'
</script>

# CbVoiceToText 音频转文字

通话/录音**转文字**展示组件：左侧 A 说话人、右侧 B 说话人气泡展示逐字稿，下方内嵌 **CbAudioPlayer** 音频播放器；播放时按时间轴自动高亮当前字幕（滚动居中），点击字幕可跳转到对应时间点播放。适用于通话记录、录音复盘等场景。

> 示例 `audioSrc` 已内置 18 秒可播放音频（`/demo-voice.wav`，段落起始处带提示哔声）；播放时可见时间走动与字幕高亮/滚动联动，点击字幕可跳转播放。

## 基础用法

<DemoBlock>
  <CbVoiceToText
    :transcripts="transcripts"
    :audio-src="audioSrc"
  />

<template #code>

```vue
<template>
  <CbVoiceToText
    :transcripts="transcripts"
    :audio-src="audioSrc"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const transcripts = [
  {
    BeginTime: 0,
    EndTime: 4200,
    Text: '您好，欢迎致电，请问有什么可以帮您？',
    SpeakerId: '0',
  },
  {
    BeginTime: 4200,
    EndTime: 9800,
    Text: '我想了解一下最近的活动优惠。',
    SpeakerId: '1',
  },
]
const audioSrc = '/demo-voice.wav'
</script>
```

</template>
</DemoBlock>

## 说明

- `transcripts` 每项含 `BeginTime` / `EndTime`（毫秒）、`Text`、`SpeakerId`（`'0'` 左侧 A，其余右侧 B）
- 播放时 `timeupdate` 事件驱动高亮：命中当前时间段的字幕高亮并滚动居中；落在片段间隙时高亮下一条
- 点击字幕调用播放器 `seekTo(time)` + `play()` 跳转播放
- 内部依赖 **CbAudioPlayer**（音频播放器：播放/暂停、进度条拖拽、倍速 0.5~2、下载），全局播放互斥（同一时刻仅一个音频播放）
- 暴露 `close` 事件（暂无默认触发，供业务扩展）

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| transcripts | 转文字数据数组 | `TranscriptItem[]` | `[]` |
| audioSrc | 音频文件地址 | `string` | `-` |
| audioId | 音频唯一标识（多实例管理） | `string` | `transcript-audio-{Date.now()}` |
| isShowAudio | 是否展示音频播放器（预留） | `boolean` | `false` |

### TranscriptItem

| 字段 | 说明 | 类型 |
| --- | --- | --- |
| ChannelId | 频道 ID | `number` |
| Text | 文本内容 | `string` |
| EmotionValue | 情绪值 | `number` |
| SilenceDuration | 静默时长 | `number` |
| BeginTime | 开始时间（毫秒） | `number` |
| EndTime | 结束时间（毫秒） | `number` |
| SpeakerId | 说话人：`'0'` 代表 A | `string` |

### Events

| 事件 | 说明 |
| --- | --- |
| close | 关闭（预留，供业务扩展） |
