---
title: CbDynamicFormGenerator 动态表单
---

<script setup>
import { reactive, h } from 'vue'

const fields = [
  { key: 'name', label: '姓名', type: 'input', rules: [{ required: true, message: '请输入姓名' }] },
  { key: 'age', label: '年龄', type: 'input', props: { type: 'number' } },
  {
    key: 'city',
    label: '城市',
    type: 'select',
    options: [
      { label: '北京', value: 'bj' },
      { label: '上海', value: 'sh' },
      { label: '广州', value: 'gz' },
    ],
  },
  {
    key: 'tags',
    label: '标签',
    type: 'checkbox',
    options: [
      { label: '前端', value: 'fe' },
      { label: '后端', value: 'be' },
    ],
  },
  { key: 'joinDate', label: '入职日期', type: 'date' },
]
const formData = reactive({
  name: '',
  age: '',
  city: '',
  tags: [],
  joinDate: '',
})

// 条件显示示例
const conditionFields = [
  { key: 'needEmail', label: '需要邮箱', type: 'radio', options: [{ label: '是', value: 'yes' }, { label: '否', value: 'no' }] },
  {
    key: 'email',
    label: '邮箱',
    type: 'input',
    showWhen: (values) => values?.needEmail === 'yes',
  },
]
const conditionData = reactive({ needEmail: 'no', email: '' })

// 自定义渲染示例
const customFields = [
  {
    key: 'amount',
    label: '金额',
    content: ({ modelValue, onUpdate }) =>
      h('div', { class: 'custom-amount' }, [
        h('span', { style: 'margin-right:6px;color:#999' }, '¥'),
        h('input', {
          style: 'border:1px solid #dcdcdc;border-radius:3px;padding:4px 8px;',
          value: modelValue || '',
          onInput: (e) => onUpdate(e.target.value),
        }),
      ]),
  },
]
const customData = reactive({ amount: '100' })
</script>

# CbDynamicFormGenerator 动态表单

基于 TDesign Form 的配置化表单生成器：通过 `fields` 配置声明式生成表单，支持输入框/下拉/复选/单选/日期/日期范围等默认控件，支持自定义渲染函数、条件显示（`hidden` / `showWhen`）、校验规则与表单校验/重置方法。

## 基础用法

通过 `fields` 配置字段，`v-model:form-data` 双向绑定表单数据。

<DemoBlock>
  <div style="border: 1px solid var(--td-border-level-2-color); border-radius: 4px; padding: 16px; max-width: 560px;">
    <CbDynamicFormGenerator v-model:form-data="formData" :fields="fields">
      <template #submit>
        <t-button theme="primary" style="margin-top: 8px;">提交</t-button>
      </template>
    </CbDynamicFormGenerator>
    <p style="margin-top: 12px; font-size: 13px; color: #666;">表单数据：{{ JSON.stringify(formData) }}</p>
  </div>

<template #code>

```vue
<template>
  <CbDynamicFormGenerator v-model:form-data="formData" :fields="fields">
    <template #submit>
      <t-button theme="primary">提交</t-button>
    </template>
  </CbDynamicFormGenerator>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

const fields = [
  { key: 'name', label: '姓名', type: 'input', rules: [{ required: true, message: '请输入姓名' }] },
  { key: 'city', label: '城市', type: 'select', options: [{ label: '北京', value: 'bj' }] },
  { key: 'tags', label: '标签', type: 'checkbox', options: [{ label: '前端', value: 'fe' }] },
  { key: 'joinDate', label: '入职日期', type: 'date' },
]
const formData = reactive({ name: '', city: '', tags: [], joinDate: '' })
</script>
```

</template>
</DemoBlock>

## 条件显示

字段配置 `hidden: true` 或 `showWhen: (values) => boolean` 控制是否展示；`showWhen` 返回 false 时字段不渲染。

<DemoBlock>
  <div style="border: 1px solid var(--td-border-level-2-color); border-radius: 4px; padding: 16px; max-width: 560px;">
    <CbDynamicFormGenerator v-model:form-data="conditionData" :fields="conditionFields" />
  </div>

<template #code>

```vue
<template>
  <CbDynamicFormGenerator v-model:form-data="conditionData" :fields="fields" />
</template>

<script setup lang="ts">
import { reactive } from 'vue'

const fields = [
  {
    key: 'needEmail',
    label: '需要邮箱',
    type: 'radio',
    options: [{ label: '是', value: 'yes' }, { label: '否', value: 'no' }],
  },
  {
    key: 'email',
    label: '邮箱',
    type: 'input',
    showWhen: (values) => values?.needEmail === 'yes',
  },
]
const conditionData = reactive({ needEmail: 'no', email: '' })
</script>
```

</template>
</DemoBlock>

## 自定义字段渲染

`field.content` 为函数时使用自定义渲染，接收 `{ modelValue, field, onUpdate }`，返回 VNode。

<DemoBlock>
  <div style="border: 1px solid var(--td-border-level-2-color); border-radius: 4px; padding: 16px; max-width: 560px;">
    <CbDynamicFormGenerator v-model:form-data="customData" :fields="customFields" />
  </div>

<template #code>

```vue
<template>
  <CbDynamicFormGenerator v-model:form-data="customData" :fields="fields" />
</template>

<script setup lang="ts">
import { reactive, h } from 'vue'

const fields = [
  {
    key: 'amount',
    label: '金额',
    content: ({ modelValue, onUpdate }) =>
      h('div', { class: 'custom-amount' }, [
        h('span', '¥'),
        h('input', {
          value: modelValue || '',
          onInput: (e) => onUpdate(e.target.value),
        }),
      ]),
  },
]
const customData = reactive({ amount: '100' })
</script>
```

</template>
</DemoBlock>

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| fields | 字段配置数组（见下方字段配置） | `FormField[]` | `-` |

### v-model

| 值 | 说明 |
| --- | --- |
| formData | 表单数据对象（字段 key 为键），字段输入变化实时同步 |

### Exposed

| 方法 | 说明 |
| --- | --- |
| validate | 校验全部字段，通过返回 `true` |
| reset | 重置表单为初始值 |

### 字段配置

| 字段 | 说明 |
| --- | --- |
| key | 字段标识（必传，对应 formData 的键） |
| label | 展示文案，可为字符串或渲染函数 |
| type | `input` / `select` / `checkbox` / `radio` / `date` / `dateRange`，缺省为 `input` |
| props | 透传给控件（`t-input` 等）的额外属性 |
| options | `select` / `checkbox` / `radio` 的选项 `{ label, value }[]` |
| rules | TDesign 校验规则数组 |
| hidden | 是否隐藏字段 |
| disabled | 是否禁用字段 |
| showWhen | 条件显示函数 `(values) => boolean`，返回 false 不渲染 |
| content | 自定义渲染函数 `({ modelValue, field, onUpdate }) => VNode`（与默认控件互斥） |
