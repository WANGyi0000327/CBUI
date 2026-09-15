---
title: CbTimeSelectLine 时间轴
---

<script setup>
import { ref } from 'vue'

const activeKey = ref('202401')
const timeRanges = ['202401', '202406']
const completedTime = '20240331'
</script>

# CbTimeSelectLine 时间轴

竖向**时间轴**组件：按月份展示时间节点，超出数据范围自动扩展 4 个月（不可点）。已完成月份打勾（`completedTime` 之前）、进行中月份显示进度图标，点击节点回传 `change` 并高亮。适用于项目里程碑 / 计划进度等展示。

## 基础用法

<DemoBlock>
  <div style="display: flex; gap: 40px;">
    <div>
      <CbTimeSelectLine
        v-model="activeKey"
        :time-ranges="timeRanges"
        :completed-time="completedTime"
        height="340px"
      />
    </div>
    <div style="color: #666; font-size: 13px;">
      当前选中 key：{{ activeKey }}
    </div>
  </div>

<template #code>

```vue
<template>
  <CbTimeSelectLine v-model="activeKey" :time-ranges="timeRanges" :completed-time="completedTime" />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const activeKey = ref('202401')
const timeRanges = ['202401', '202406']
const completedTime = '20240331'
</script>
```

</template>
</DemoBlock>

## 说明

- `timeRanges` 传 `[开始, 结束]`（`YYYYMM` 格式），`showMoreMonth`（默认 true）会在前后各扩展 4 个月作为不可点区域
- `completedTime`（如 `20240331`）之前的月份显示完成图标，之后显示进度图标；不传则全部显示进度图标
- 点击可点节点：更新 `v-model`、触发 `change`、滚动到视口居中并高亮
- 暴露 `refresh()`：重新滚动到当前选中节点

## API

### Props

| 属性          | 说明                              | 类型             | 默认值       |
| ------------- | --------------------------------- | ---------------- | ------------ |
| height        | 容器高度                          | `string`         | `'435px'`    |
| timeRanges    | 数据范围 `[开始, 结束]`（YYYYMM） | `string[]`       | `[]`         |
| completedTime | 已完成截止时间                    | `string \| null` | `null`       |
| completedIcon | 已完成图标名（cb-icon）           | `string`         | `'zhengque'` |
| progressIcon  | 进行中图标名（cb-icon）           | `string`         | `'ddai'`     |
| showMoreMonth | 范围外扩展 4 个月（不可点）       | `boolean`        | `true`       |
| v-model       | 当前选中节点 key                  | `string`         | `-`          |

### Events

| 事件   | 说明               | 参数 |
| ------ | ------------------ | ---- |
| change | 点击可点节点时触发 | `-`  |

### Expose

| 方法    | 说明               |
| ------- | ------------------ |
| refresh | 滚动到当前选中节点 |
