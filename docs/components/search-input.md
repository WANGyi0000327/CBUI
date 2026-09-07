---
title: CbSearchInput 搜索输入框
---

<script setup>
import { ref } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'

const searchText = ref('')
const onSearch = (val) => {
  MessagePlugin.success(`搜索：${val || '（空）'}`)
}
</script>

# CbSearchInput 搜索输入框

基于 TDesign `t-input` 封装的搜索输入框：输入框内嵌"搜索"按钮与清空图标，`v-model` 双向绑定（**自动 trim**），回车或点击搜索按钮触发 `search` 事件。

## 基础用法

<DemoBlock>
  <CbSearchInput v-model="searchText" @search="onSearch" />

<template #code>

```vue
<template>
  <CbSearchInput v-model="searchText" @search="onSearch" />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const searchText = ref('')
const onSearch = (val: string) => {
  console.log('搜索：', val)
}
</script>
```

</template>
</DemoBlock>

## 自定义宽度与禁用

<DemoBlock>
  <CbSearchInput
    v-model="searchText"
    searchwidth="400px"
    :disabled="true"
    placeholder="禁用状态"
    @search="onSearch"
  />

<template #code>

```vue
<template>
  <CbSearchInput
    v-model="searchText"
    searchwidth="400px"
    :disabled="true"
    placeholder="禁用状态"
    @search="onSearch"
  />
</template>
```

</template>
</DemoBlock>

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| modelValue | 输入值（`v-model` 绑定，自动 trim） | `string` | — |
| loading | 加载中（预留） | `boolean` | `false` |
| disabled | 是否禁用 | `boolean` | `false` |
| searchwidth | 输入框宽度 | `string` | `'300px'` |

> 其余属性透传给 t-input（如 `placeholder`、`maxlength` 等）。

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| search | 回车或点击搜索按钮/清空图标时触发 | `(value?: string)` 当前关键词（清空时无参数） |

### Expose

| 方法 | 说明 |
| --- | --- |
| handleFocus | 聚焦输入框 |
