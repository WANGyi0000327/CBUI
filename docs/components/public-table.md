---
title: CbPublicTable 公开表格
---

<script setup>
import { ref } from 'vue'

const columns = [
  { colKey: 'name', title: '姓名', width: 120 },
  { colKey: 'dept', title: '部门', width: 160 },
  { colKey: 'role', title: '角色', width: 140 },
  { colKey: 'status', title: '状态', width: 100 },
]
const tableData = ref([
  { id: '1', name: '张三', dept: '研发部', role: '前端工程师', status: '在职' },
  { id: '2', name: '李四', dept: '研发部', role: '后端工程师', status: '在职' },
  { id: '3', name: '王五', dept: '产品部', role: '产品经理', status: '在职' },
  { id: '4', name: '赵六', dept: '测试部', role: '测试工程师', status: '休假' },
])
const reqForm = ref({ pageIndex: 1, pageSize: 10, keywords: '' })
const handleReqTable = (data, type) => {
  console.log('请求表格:', type, data)
}
</script>

# CbPublicTable 公开表格

基于 TDesign Table 封装的通用业务表格：内置搜索框、筛选弹层、列设置（CbColumnControl）、分页（CBPagination）、滚动位置缓存与行/单元格/排序/选择等事件的统一转发，通过 `tableConfig` 声明式配置。

## 基础用法

`tableConfig` 传入列配置与数据；头部内置搜索框（`isShowSearch`）与筛选（`isShowFilter`）；`@reqTable` 统一接收搜索/翻页请求；`total > 0` 时显示分页：

<DemoBlock>
  <div
    style="
      border: 1px solid var(--td-border-level-2-color);
      border-radius: 4px;
      padding: 16px;
      height: 320px;
      box-sizing: border-box;
    "
  >
    <CbPublicTable
      :table-config="{
        data: tableData,
        columns,
        rowKey: 'id',
        searchKey: 'keywords',
        searchPlaceholder: '请输入姓名',
        isShowSearch: true,
        isShowFilter: true,
        showColumn: ['name', 'dept', 'role', 'status'],
        closeoperation: true,
      }"
      :total="tableData.length"
      @req-table="handleReqTable"
    >
      <template #contentfilter>
        <div style="padding: 12px;">
          <t-input placeholder="按部门筛选" style="width: 220px" />
        </div>
      </template>
    </CbPublicTable>
  </div>

<template #code>

```vue
<template>
  <!-- CbPublicTable 依赖父容器高度撑开表格区（表格区 flex-grow:1），
       业务页面容器自带高度；文档演示需手动给容器高度 -->
  <div style="height: 320px; box-sizing: border-box;">
    <CbPublicTable
    :table-config="{
      data: tableData,
      columns,
      rowKey: 'id',
      searchKey: 'keywords',
      searchPlaceholder: '请输入姓名',
      isShowSearch: true,
      isShowFilter: true,
      showColumn: ['name', 'dept', 'role', 'status'],
      closeoperation: true,
    }"
    :total="tableData.length"
    @req-table="handleReqTable"
  >
    <!-- 筛选弹层内容 -->
    <template #contentfilter>
      <div style="padding: 12px;">
        <t-input placeholder="按部门筛选" style="width: 220px" />
      </div>
    </template>
  </CbPublicTable>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const columns = [
  { colKey: 'name', title: '姓名', width: 120 },
  { colKey: 'dept', title: '部门', width: 160 },
  { colKey: 'role', title: '角色', width: 140 },
  { colKey: 'status', title: '状态', width: 100 },
]
const tableData = ref([
  { id: '1', name: '张三', dept: '研发部', role: '前端工程师', status: '在职' },
  { id: '2', name: '李四', dept: '研发部', role: '后端工程师', status: '在职' },
])
// 统一接收搜索 / 翻页请求
const handleReqTable = (data, type) => {
  console.log('请求表格:', type, data)
}
</script>
```

</template>
</DemoBlock>

## 事件

| 事件 | 说明 | 参数 |
| --- | --- | --- |
| reqTable | 搜索 / 翻页请求 | `(data: ReqForm, type: 'search' \| 'page')` |
| row-click | 行点击 | `(row, index, event)` |
| cell-click | 单元格点击 | `(row, col)` |
| page-change | 分页变化（透传 t-table） | `pageInfo` |
| sort-change | 排序变化 | `sort` |
| drag-sort | 拖拽排序 | `context` |
| SelectChange | 行选择变化 | `(data: string[], ctx)` |
| SelectData | 选择数据 | `data: TableRowData[]` |
| handleReset | 筛选重置 | `(formdata?, type?)` |
| submit_reqTable | 筛选提交（isreqTable=false 时） | `data?` |
| saveConfig | 列配置保存 | `config` |
| handleSelectHigh | 高频筛选变化 | `data` |
| scroll | 表格滚动 | `params` |
| handleChange | 分页变化（内部封装） | `pageInfo` |

## Slots

| 名称 | 说明 |
| --- | --- |
| front-operation | 头部左侧操作区 |
| extrasearch | 搜索框前插槽 |
| place | 筛选后占位 |
| contentfilter | 筛选弹层内容 |
| batchOperation / batch | 头部右侧批量操作区 |
| bottom-operation | 头部下方操作区 |
| prompt | 提示区域 |
| highTemp | 高频搜索前插槽 |
| table_bottom | 表格下方插槽 |
| PageInfoMationFront | 分页前插槽 |
| 其余具名 slot | 透传给 t-table 同名插槽 |

## Exposed（通过 ref 访问）

| 方法 | 说明 |
| --- | --- |
| reqForm | 当前请求参数（pageIndex / pageSize / searchKey） |
| clearInput() | 清空搜索关键词 |
| resetPageIndex() | 页码重置为 1 |
| clearHighList() | 清空高频筛选 |

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| tableConfig | 表格配置（必填） | `ConfigType` | — |
| total | 数据总数（控制分页显示） | `number` | `0` |
| stripe | 斑马纹 | `boolean` | `false` |
| bordered | 边框 | `boolean` | `true` |
| hover | 悬浮效果 | `boolean` | `true` |
| tableLayout | 布局方式 | `'auto' \| 'fixed'` | `'fixed'` |
| size | 表格尺寸 | `TableProps['size']` | `'medium'` |
| showHeader | 显示表头 | `boolean` | `true` |
| loading | 加载状态 | `boolean` | `false` |
| cellEmptyContent | 空单元格占位 | `string` | `'-'` |
| resizable | 可调整列宽 | `boolean` | `true` |
| maxHeight | 表格最大高度 | `string` | `'100%'` |
| selectedRowKeys | 选中行 key | `TableProps['selectedRowKeys']` | `[]` |
| reserveSelectedRowOnPaginate | 分页保留选中 | `boolean` | `false` |
| showpage | 显示分页 | `boolean` | `true` |
| showpageForever | 数据为空也显示分页 | `boolean` | `false` |
| pageSizeOptions | 分页每页条数选项 | `number[]` | `[30, 50, 100]` |
| totalContent | 分页显示总数 | `boolean` | `true` |
| filterNumber | 筛选项数量 | `number` | `0` |
| show_hender | 显示头部操作区 | `boolean` | `true` |
| openthere | 引用场景（customize 时去掉表格外框） | `string` | `''` |
| cacheScroll | 缓存滚动位置 | `boolean` | `true` |

### ConfigType

| 属性 | 说明 | 类型 |
| --- | --- | --- |
| data | 表格数据 | `any[]` |
| columns | 列配置 | `any[]` |
| rowKey | 行 key 字段 | `string` |
| searchKey | 搜索关键字字段名 | `string` |
| searchPlaceholder | 搜索框占位符 | `string` |
| isShowSearch | 显示搜索框 | `boolean` |
| isShowFilter | 显示筛选 | `boolean` |
| filterList | 筛选列表 | `SearchItem[]` |
| popupwidth | 筛选弹层宽度 | `string` |
| isCustomHeader | 自定义表头（列设置） | `boolean` |
| showColumn | 显示列 key 列表 | `string[]` |
| closeoperation | 关闭列设置操作按钮 | `boolean` |
| ishighSearch | 显示高频搜索 | `boolean` |
| highSearchList | 高频搜索列表 | `HighSearchItem[]` |
| prompt | 显示提示插槽 | `boolean` |
| maxPageBtn | 最大页码按钮数 | `number` |
| rowClassName | 行类名 | `string` |
