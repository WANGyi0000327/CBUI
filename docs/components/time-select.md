---
title: CbTimeSelect 时间筛选
---

<script setup>
import { ref } from 'vue'

const timeValue = ref()
const arrayValue = ref()
</script>

# CbTimeSelect 时间筛选

年月选择器（**年份箭头切换 + 月份点选**），输出对应时间范围，常用于列表页的"按月/按年筛选"。支持对象（默认）与数组两种 `v-model` 形态。

## 基础用法

<DemoBlock>
  <CbTimeSelect v-model="timeValue" />
  <div style="margin-top: 12px; color: #666; word-break: break-all">
    当前值：{{ JSON.stringify(timeValue) }}
  </div>

<template #code>

```vue
<template>
  <CbTimeSelect v-model="timeValue" />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const timeValue = ref()
</script>
```

</template>
</DemoBlock>

## 数组格式输出

设置 `format-type="array"` 时，`v-model` 输出 `[开始时间, 结束时间]`（`YYYY-MM-DD HH:mm:ss`）。

<DemoBlock>
  <CbTimeSelect v-model="arrayValue" format-type="array" />
  <div style="margin-top: 12px; color: #666; word-break: break-all">
    当前值：{{ JSON.stringify(arrayValue) }}
  </div>

<template #code>

```vue
<template>
  <CbTimeSelect v-model="arrayValue" format-type="array" />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const arrayValue = ref()
</script>
```

</template>
</DemoBlock>

## 其他模式

<DemoBlock>
  <div style="display: flex; flex-direction: column; gap: 16px;">
    <div><span style="color: #999; margin-right: 8px;">上个月锁定：</span><CbTimeSelect is-last-month /></div>
    <div><span style="color: #999; margin-right: 8px;">支持未来：</span><CbTimeSelect future /></div>
  </div>
</DemoBlock>

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| modelValue | 选中值（对象或数组格式，二者兼容输入） | `Partial<TimeFilterValue> \| TimeFilterArrayValue` | `{}` |
| type | 初始模式：current 定位当前月 / default 定位 1 月 | `'current' \| 'default'` | `'current'` |
| title | 标题文案 | `string` | `'时间'` |
| isLastMonth | 是否锁定在上个月模式 | `boolean` | `false` |
| supportFullYear | 是否支持全年选择（month 为 null） | `boolean` | `false` |
| future | 是否支持未来时间选择（当前年月 +10 年） | `boolean` | `false` |
| formatType | 返回数据格式 | `'object' \| 'array'` | `'object'` |

### Events

| 事件 | 说明 | 参数 |
| --- | --- | --- |
| update:modelValue | 值变化（格式随 formatType） | `TimeFilterValue \| TimeFilterArrayValue` |
| change | 值变化 | 同上 |

### Expose

| 方法 | 说明 |
| --- | --- |
| handleReset | 重置到默认（当前年月 / 上个月 / 1 月）并触发更新 |
