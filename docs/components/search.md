---
title: CBSearch 搜索框
---

<script setup>
import { ref } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'
const searchText = ref('')
const onSearch = (val) => {
  MessagePlugin.success(`搜索：${val || '（空）'}`)
}
</script>

# CBSearch 搜索框

基于 TDesign `t-input-adornment` + `t-input` 封装的搜索框：输入框 + 追加"搜索"按钮，`v-model` 双向绑定关键词，点击按钮触发 `search` 事件透出关键词。

> 组件 `defineOptions` name 为 **`CBSearch`**（用户指定，非 Cb 前缀），模板中请使用 `<CBSearch>` 标签。

## 基础用法

<DemoBlock>
  <CBSearch v-model="searchText" @search="onSearch" />

<template #code>

```vue
<template>
  <CBSearch v-model="searchText" @search="onSearch" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'

const searchText = ref('')
const onSearch = (val: string) => {
  MessagePlugin.success(`搜索：${val}`)
}
</script>
```

</template>
</DemoBlock>

## 自定义样式

通过 `inputWidth` 控制整体宽度，`placeholder` 自定义占位符，`clearable` 控制是否显示清空按钮：

<DemoBlock>
  <CBSearch
    v-model="searchText"
    input-width="400px"
    placeholder="请输入名称/编号"
    :clearable="false"
    @search="onSearch"
  />

<template #code>

```vue
<template>
  <CBSearch
    v-model="searchText"
    input-width="400px"
    placeholder="请输入名称/编号"
    :clearable="false"
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
| modelValue | 关键词（`v-model` 绑定） | `string` | `''` |
| inputWidth | 输入框整体宽度 | `string` | `'300px'` |
| placeholder | 占位提示文案 | `string` | `'请输入内容'` |
| clearable | 是否显示清空按钮 | `boolean` | `true` |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| search | 点击搜索按钮时触发 | `(value: string)` 当前关键词 |
