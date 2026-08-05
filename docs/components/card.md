---
title: Card 商品卡片
description: 商品展示卡片，包含商品图片、名称、价格、销量及操作按钮。
---

# Card 商品卡片

商品展示卡片，集成主图、名称、价格、销量信息及加购/签单操作按钮。

## 基础用法

<DemoBlock>
  <CbCard
    :items="{
      id: 1,
      productName: '商品名称示例',
      minPrice: 99,
      maxPrice: 199,
      totalSales: 1234,
      currentMonthSales: 56,
      mainImg: 'https://tdesign.gtimg.com/site/upload1/b335a075-7bee-4547-b79f-309506887a4d.png',
      addCar: false,
      classId: 1,
      className: '分类',
      lastMonthSales: 40,
      monthOverMonth: 0.4,
      productType: 1,
      productTypeDesc: '商品',
    }"
    :over-width="0"
  />

  <template #code>

```vue
<template>
  <CbCard
    :items="{
      id: 1,
      productName: '商品名称示例',
      minPrice: 99,
      maxPrice: 199,
      totalSales: 1234,
      currentMonthSales: 56,
      mainImg: 'https://example.com/product.png',
      addCar: false,
      classId: 1,
      className: '分类',
      lastMonthSales: 40,
      monthOverMonth: 0.4,
      productType: 1,
      productTypeDesc: '商品',
    }"
    :over-width="0"
  />
</template>
```

  </template>
</DemoBlock>

## 自适应图片高度

设置 `adaptive` 属性，图片高度根据卡片宽度按 0.54 比例自动计算。

<DemoBlock>
  <CbCard
    :items="{
      id: 2,
      productName: '自适应高度商品',
      minPrice: 50,
      maxPrice: 50,
      totalSales: 888,
      currentMonthSales: 30,
      mainImg: 'https://tdesign.gtimg.com/site/upload1/b335a075-7bee-4547-b79f-309506887a4d.png',
      addCar: true,
      classId: 1,
      className: '分类',
      lastMonthSales: 20,
      monthOverMonth: 0.5,
      productType: 1,
      productTypeDesc: '商品',
    }"
    adaptive
    :over-width="0"
  />

  <template #code>

```vue
<template>
  <CbCard
    :items="productData"
    adaptive
    :over-width="0"
  />
</template>
```

  </template>
</DemoBlock>

## 隐藏操作按钮

通过 `isbugcart` 和 `issignorder` 控制按钮显隐。

<DemoBlock>
  <CbCard
    :items="{
      id: 3,
      productName: '无按钮商品',
      minPrice: 10,
      maxPrice: 10,
      totalSales: 100,
      currentMonthSales: 5,
      mainImg: 'https://tdesign.gtimg.com/site/upload1/b335a075-7bee-4547-b79f-309506887a4d.png',
      addCar: false,
      classId: 1,
      className: '分类',
      lastMonthSales: 3,
      monthOverMonth: 0.66,
      productType: 1,
      productTypeDesc: '商品',
    }"
    :isbugcart="false"
    :issignorder="false"
    :over-width="0"
  />

  <template #code>

```vue
<template>
  <CbCard
    :items="productData"
    :isbugcart="false"
    :issignorder="false"
    :over-width="0"
  />
</template>
```

  </template>
</DemoBlock>

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| items | 商品数据 | `ProductHallListType` | - |
| overWidth | 宽度溢出补偿（px） | `number` | 0 |
| minCardWidth | 卡片最小宽度（px） | `number` | 276 |
| height | 图片区域固定高度 | `string` | '220px' |
| adaptive | 是否自适应图片高度 | `boolean` | false |
| isbugcart | 是否显示加购按钮 | `boolean` | true |
| issignorder | 是否显示签单按钮 | `boolean` | true |
| isShowOffLine | 是否显示下架遮罩 | `boolean` | false |
| productionWallRef | 生产墙 ref（保留兼容） | `unknown` | - |

### ProductHallListType

| 字段 | 说明 | 类型 |
| --- | --- | --- |
| id | 商品 ID | `number` |
| productName | 商品名称 | `string` |
| mainImg | 主图 URL | `string` |
| minPrice | 最低价 | `number` |
| maxPrice | 最高价 | `number` |
| totalSales | 总销量 | `number` |
| currentMonthSales | 当月销量 | `number` |
| addCar | 是否已加购 | `boolean` |
| productType | 商品类型 | `number` |
| source | 来源 | `string` |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| click | 点击卡片时触发 | `(id: number, productType: number)` |
| addcart | 点击加购按钮时触发 | `AddCartEventPayload` |
| signorder | 点击签单按钮时触发 | - |
| resizeHanlder | resize 回调（保留兼容） | - |

### AddCartEventPayload

| 字段 | 说明 | 类型 |
| --- | --- | --- |
| type | 操作类型 | `string` |
| productType | 商品类型 | `number` |
| productId | 商品 ID | `number` |
| productLogo | 商品主图 | `string` |
| productName | 商品名称 | `string` |
| source | 来源 | `string` |
| addCar | 是否已加购 | `boolean` |
