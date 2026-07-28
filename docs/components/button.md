---
title: Button 按钮
---

# Button 按钮

常用的操作按钮，支持多种类型与尺寸。

## 基础用法

使用 `type` 属性定义按钮样式。

<DemoBlock>
  <CbButton>默认按钮</CbButton>
  <CbButton type="primary">主要按钮</CbButton>
  <CbButton type="danger">危险按钮</CbButton>

  <template #code>

```vue
<template>
  <CbButton>默认按钮</CbButton>
  <CbButton type="primary">主要按钮</CbButton>
  <CbButton type="danger">危险按钮</CbButton>
</template>
```

  </template>
</DemoBlock>

## 尺寸

使用 `size` 属性设置按钮尺寸。

<DemoBlock>
  <CbButton size="small">小按钮</CbButton>
  <CbButton size="medium">中等按钮</CbButton>
  <CbButton size="large">大按钮</CbButton>

  <template #code>

```vue
<template>
  <CbButton size="small">小按钮</CbButton>
  <CbButton size="medium">中等按钮</CbButton>
  <CbButton size="large">大按钮</CbButton>
</template>
```

  </template>
</DemoBlock>

## 状态

按钮支持禁用和加载中状态。

<DemoBlock>
  <CbButton disabled>禁用按钮</CbButton>
  <CbButton loading>加载中</CbButton>
  <CbButton type="primary" loading>加载中</CbButton>

  <template #code>

```vue
<template>
  <CbButton disabled>禁用按钮</CbButton>
  <CbButton loading>加载中</CbButton>
  <CbButton type="primary" loading>加载中</CbButton>
</template>
```

  </template>
</DemoBlock>

## 块级按钮

使用 `block` 属性让按钮占满父容器宽度。

<DemoBlock>
  <CbButton type="primary" block>块级按钮</CbButton>

  <template #code>

```vue
<template>
  <CbButton type="primary" block>块级按钮</CbButton>
</template>
```

  </template>
</DemoBlock>

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| type | 按钮类型 | `'primary' \| 'default' \| 'danger'` | 'default' |
| size | 按钮尺寸 | `'small' \| 'medium' \| 'large'` | 'medium' |
| disabled | 是否禁用 | `boolean` | false |
| loading | 是否加载中 | `boolean` | false |
| nativeType | 原生 button 类型 | `'button' \| 'submit' \| 'reset'` | 'button' |
| block | 是否为块级元素（占满父容器宽度） | `boolean` | false |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| click | 点击按钮时触发 | `MouseEvent` |

### Slots

| 插槽名 | 说明 |
| --- | --- |
| default | 按钮内容 |
