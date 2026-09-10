---
title: CbFilterPopup 筛选弹层
---

<script setup>
import { ref } from 'vue'

const fields = [
  { key: 'name', label: '姓名', type: 'input' },
  { key: 'status', label: '状态', type: 'select', options: [
    { label: '启用', value: 'enabled' },
    { label: '禁用', value: 'disabled' },
  ] },
  { key: 'date', label: '日期', type: 'date' },
]
const formData = ref({ name: '', status: '', date: '' })
const onQuery = () => console.log('触发查询', JSON.stringify(formData.value))
</script>

# CbFilterPopup 筛选弹层

基于 TDesign Popup + CbDynamicFormGenerator 的筛选弹层组件：点击"筛选"按钮弹出动态表单，支持重置/确定/清除；表单值与默认值不一致时按钮高亮并显示筛选条件数量角标。

## 基础用法

通过 `v-model:formData` 双向绑定表单值；`fields` 配置表单项（复用 CbDynamicFormGenerator 的字段协议）；点击"确定"或"重置"后触发 `query` 事件，父组件自行查询。

<DemoBlock>
  <div style="padding: 16px 0">
    <CbFilterPopup :fields="fields" v-model:formData="formData" @query="onQuery" />
  </div>

<template #code>

```vue
<template>
  <CbFilterPopup
    :fields="fields"
    v-model:formData="formData"
    @query="onQuery"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const fields = [
  { key: 'name', label: '姓名', type: 'input' },
  { key: 'status', label: '状态', type: 'select', options: [
    { label: '启用', value: 'enabled' },
    { label: '禁用', value: 'disabled' },
  ] },
  { key: 'date', label: '日期', type: 'date' },
]
const formData = ref({ name: '', status: '', date: '' })
const onQuery = () => {
  // 根据 formData 发起查询
}
</script>
```

</template>
</DemoBlock>

## 自定义内容

`content` 插槽可完全替换弹层主体（默认渲染 CbDynamicFormGenerator + 底部按钮）。

<DemoBlock>
  <div style="padding: 16px 0">
    <CbFilterPopup :fields="fields" v-model:formData="formData" @query="onQuery">
      <template #content>
        <div style="padding: 12px; color: #666">自定义筛选内容</div>
      </template>
    </CbFilterPopup>
  </div>

<template #code>

```vue
<template>
  <CbFilterPopup :fields="fields" v-model:formData="formData">
    <template #content>
      <div style="padding: 12px; color: #666">自定义筛选内容</div>
    </template>
  </CbFilterPopup>
</template>
```

</template>
</DemoBlock>

## API

### Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| fields | `FormField[]` | — | 表单项配置（复用 CbDynamicFormGenerator 字段协议：key/label/type/options/rules/showWhen 等） |
| formData | `FormValues` | — | 表单值（`v-model:formData` 双向绑定，必填） |
| disabled | `boolean` | `false` | 禁用筛选按钮 |
| loading | `boolean` | `false` | 按钮加载中 |

### Events

| 事件名 | 说明 |
| --- | --- |
| query | 点击"确定"/"重置"/清除图标后触发，此时 formData 已同步为最新值，父组件在此发起查询 |

### Slots

| 插槽名 | 说明 |
| --- | --- |
| content | 自定义弹层主体（默认：CbDynamicFormGenerator + 重置/确定按钮） |

### 说明

- 筛选角标：任一字段值与初始默认值不同（数组判断有内容）即计数并高亮按钮，同时显示清除图标。
- 打开弹层时会快照当前表单值；"重置"恢复为打开时快照，"确定"把弹层内改动写回 `formData` 并触发 `query`。
- 内部复用 CbDynamicFormGenerator（`ref` 调用其 `reset()`），依赖 `lodash.cloneDeep`。
