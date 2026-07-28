---
title: Card 卡片
---

# Card 卡片

通用卡片容器。

## 基础用法

<DemoBlock>
  <CbCard title="卡片标题">
    卡片内容区域，用于展示详细信息。
  </CbCard>

  <template #code>

```vue
<template>
  <CbCard title="卡片标题">
    卡片内容区域，用于展示详细信息。
  </CbCard>
</template>
```

  </template>
</DemoBlock>

## 无边框

<DemoBlock>
  <CbCard title="无边框卡片" :bordered="false">
    无边框卡片样式。
  </CbCard>

  <template #code>

```vue
<template>
  <CbCard title="无边框卡片" :bordered="false">
    无边框卡片样式。
  </CbCard>
</template>
```

  </template>
</DemoBlock>

## 带阴影

<DemoBlock>
  <CbCard title="带阴影卡片" shadow>
    带阴影的卡片样式。
  </CbCard>

  <template #code>

```vue
<template>
  <CbCard title="带阴影卡片" shadow>
    带阴影的卡片样式。
  </CbCard>
</template>
```

  </template>
</DemoBlock>

## 自定义头部

<DemoBlock>
  <CbCard>
    <template #header>
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span>自定义头部</span>
        <CbButton size="small">操作</CbButton>
      </div>
    </template>
    卡片内容区域。
  </CbCard>

  <template #code>

```vue
<template>
  <CbCard>
    <template #header>
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span>自定义头部</span>
        <CbButton size="small">操作</CbButton>
      </div>
    </template>
    卡片内容区域。
  </CbCard>
</template>
```

  </template>
</DemoBlock>

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| title | 卡片标题 | `string` | - |
| bordered | 是否显示边框 | `boolean` | true |
| shadow | 是否显示阴影 | `boolean` | false |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| click | 点击卡片时触发 | `MouseEvent` |

### Slots

| 插槽名 | 说明 |
| --- | --- |
| default | 卡片内容 |
| header | 卡片头部 |
