---
title: CbTags 标签折叠
---

<script setup>
const values = ['标签一', '标签二', '标签三', '标签四', '标签五']
</script>

# CbTags 标签折叠

展示字符串标签列表（基于 `t-tag`），超出 `max` 个时折叠为 `+N`。适用于表格列中展示多个标签/枚举值，空间不足时自动折叠。

## 基础用法

<DemoBlock>
  <CbTags :values="values" :max="3" />
  <div style="margin-top: 12px; color: #666">max 不传（默认 Infinity）时全部展示：</div>
  <CbTags :values="values" />

<template #code>

```vue
<template>
  <!-- 最多展示 3 个，其余折叠为 +2 -->
  <CbTags :values="values" :max="3" />
</template>

<script setup lang="ts">
const values = ['标签一', '标签二', '标签三', '标签四', '标签五']
</script>
```

</template>
</DemoBlock>

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| values | 标签文本列表 | `string[]` | `[]` |
| max | 最多展示数量（超出部分折叠为 +N） | `number` | `Infinity` |
