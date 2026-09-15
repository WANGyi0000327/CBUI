<template>
  <div ref="tableRootEl" class="public-table h-full flex flex-col justify-between gap-[20px]">
    <div v-if="show_hender" class="flex flex-col">
      <!-- 头部组件 -->
      <div class="flex flex-col">
        <div class="flex justify-between flex-wrap gap-[8px]">
          <div class="flex items-center gap-[8px]">
            <slot name="front-operation"></slot>
            <!-- 搜索框 -->
            <!-- v-if="selectedRowKeys.length <= 0" -->
            <div class="flex items-center gap-[8px] flex-wrap">
              <slot name="extrasearch"></slot>
              <cb-search-input
                v-if="safeTableConfig.isShowSearch"
                v-model="reqForm[(safeTableConfig.searchKey as keyof typeof reqForm)]"
                :placeholder="tableConfig.searchPlaceholder"
                :searchwidth="safeTableConfig.searchwidth"
                @search="reqTable"
              />
              <!-- 筛选框 -->
              <CbSearchFilter
                v-if="safeTableConfig.isShowFilter"
                :list="safeTableConfig.filterList"
                :popupwidth="safeTableConfig.popupwidth"
                :filter-number="filterNumber"
                @submit="submit_reqTable"
                @reset="handleReset"
              >
                <template #content>
                  <slot name="contentfilter"></slot>
                </template>
              </CbSearchFilter>
              <!-- 占位 -->
              <slot name="place"></slot>
            </div>
          </div>
          <!-- 多选框 选中之后隐藏筛选和搜索 -->
          <!-- v-else -->
          <div style="margin-left: auto; max-width: 100%">
            <div class="flex items-center gap-[8px] align-right">
              <span style="color: #999999">
                <!-- 处理合并页数据异常 -->
                <span v-if="SelecteddataIDs.length > 0" style="color: #999999"
                  >已选 {{ SelecteddataIDs.length }} 项</span
                >
                <span
                  v-if="selectedRowKeys.length > 0 && SelecteddataIDs.length === 0"
                  style="color: #999999"
                  >已选 {{ selectedRowKeys.length }} 项</span
                >
              </span>
              <slot name="batchOperation"></slot>
              <!-- 操作按钮 -->
              <slot name="batch"></slot>
            </div>
          </div>
          <!-- <div class="flex gap-[8px]">
          </div> -->
        </div>
        <div>
          <slot name="bottom-operation"></slot>
        </div>
        <div v-if="safeTableConfig.prompt">
          <slot name="prompt"></slot>
        </div>
        <!-- 高频搜索展示 -->
        <div class="flex gap-[10px] items-center mt-[10px]">
          <slot name="highTemp"></slot>
          <div
            v-if="
              safeTableConfig.ishighSearch &&
              tableConfig.highSearchList &&
              tableConfig.highSearchList.length > 0
            "
          >
            <HighSearchList
              ref="highSearch"
              :high-search-list="tableConfig.highSearchList"
              @get-high-list="getHighList"
            />
          </div>
        </div>
      </div>
    </div>
    <div :class="openthere === 'customize' ? '' : 'table_box'">
      <t-table
        :row-key="safeTableConfig.rowKey"
        :data="tableConfig.data"
        :columns="!!tableConfig.isCustomHeader ? currentColumns : tableConfig.columns"
        :stripe="stripe"
        :bordered="bordered"
        :hover="hover"
        :table-layout="tableLayout"
        :row-class-name="tableConfig?.rowClassName"
        :size="size"
        :sort-icon="sortIcon"
        :pagination="pagination"
        :footer-summary="footerSummary"
        :show-header="showHeader"
        :cell-empty-content="cellEmptyContent"
        :loading="loading"
        :resizable="resizable"
        :drag-sort="dragSort"
        :max-height="maxHeight"
        :height="tableConfig.data.length === 0 ? maxHeight : ''"
        :active-row-type="activeRowType"
        :selected-row-keys="selectedRowKeys"
        :reserve-selected-row-on-paginate="reserveSelectedRowOnPaginate"
        v-bind="$attrs"
        class="min-h-[0]"
        :class="[customHoverClass]"
        @row-click="_handleRowClick"
        @page-change="_handlePageChange"
        @cell-click="_handleCellClick"
        @sort-change="sortChange"
        @drag-sort="onDragSort"
        @select-change="rehandleSelectChange"
        @scroll="_handleScroll"
      >
        <template v-if="!!tableConfig.isCustomHeader" #titleOperation="{ col }">
          <div class="flex items-center justify-between">
            <div :style="{ width: col.DWidth }">
              {{ col.displayName || '操作' }}
            </div>
            <div class="absolute h-full flex items-center" :style="{ right: col.DRight || '0px' }">
              <CbColumnControl
                v-if="!!tableConfig.isCustomHeader"
                v-model:visible="showColumnControl"
                v-model:column-config="columnConfig"
                :closeoperation="tableConfig.closeoperation"
                :all-columns="tableConfig.columns"
                @save="handleSaveConfig"
              >
                <!-- 自定义触发按钮 -->
                <CbIcon
                  :size="'18px'"
                  :name="'shezhi'"
                  style="margin-right: 10px; cursor: pointer"
                />
              </CbColumnControl>
            </div>
          </div>
        </template>
        <template v-for="(_, name) in $slots" #[name]="scope">
          <slot :name="name" v-bind="scope"></slot>
        </template>
      </t-table>
      <slot name="table_bottom"></slot>
    </div>
    <PageInfoMation
      v-if="shouldShowPagination"
      v-model:current-page="reqForm.pageIndex"
      v-model:page-size="reqForm.pageSize"
      class="CBPagination"
      :page-size-options="pageSizeOptions"
      :total="computedTotal"
      :total-content="totalContent"
      :max-page-btn="tableConfig.maxPageBtn"
      @on-change="handleChange"
    >
      <template v-if="$slots.PageInfoMationFront" #PageInfoMationFront>
        <slot name="PageInfoMationFront"></slot>
      </template>
    </PageInfoMation>
  </div>
</template>
<script lang="tsx" setup>
import type {
  DragSortContext,
  PrimaryTableCol,
  TableProps,
  TableRowData,
  TableSort,
  SelectOptions,
} from 'tdesign-vue-next'
import { computed, h, nextTick, onActivated, reactive, ref, useTemplateRef, watch } from 'vue'
import HighSearchList from './components/hightSearchList.vue'
import PageInfoMation from './components/pageInfoMation.vue'
import type { ConfigType, PageInfo, ReqForm } from './interface'
defineOptions({
  name: 'CbPublicTable',
})
// 定义组件的 Props 类型
interface SimpleTableProps {
  footerSummary?: any
  maxHeight?: string
  stripe?: boolean //是否显示斑马纹
  bordered?: boolean //是否显示边框
  hover?: boolean //是否显示悬浮效果
  // 表格布局方式 auto/fixed
  tableLayout?: 'auto' | 'fixed'
  // 表格尺寸
  size?: TableProps['size']
  // 是否显示表头
  showHeader?: boolean
  // 分页配置
  pagination?: TableProps['pagination']
  // 加载状态
  loading?: boolean
  // 单元格空内容占位符
  cellEmptyContent?: string
  // 是否可调整列宽
  resizable?: boolean
  // 是否开启拖拽排序
  dragSort?: TableProps['dragSort']
  // 是否动态表格高度
  isReduceHeight?: boolean
  // 减少表格高度
  reduceheight?: string
  // 是否显示分页
  showpage?: boolean
  // 是否一直显示分页 也就是数据为空时 不隐藏分页
  showpageForever?: boolean
  // 选中行类型
  activeRowType?: TableProps['activeRowType']
  // 选中行键值数组
  selectedRowKeys?: TableProps['selectedRowKeys']
  // 选中行ID数组
  SelecteddataIDs?: Array<string>
  // 是否保留分页时选中的行
  reserveSelectedRowOnPaginate?: boolean
  total?: number
  reducemaxHeight?: string //需要减少的最大高度
  tableConfig: ConfigType
  isreqTable?: boolean //是否使用默认确定事件
  pageParams?: PageInfo
  filterNumber?: number //筛选项数量
  pageSizeOptions?: any //分页选项
  totalContent?: boolean //分页 是否显示总数
  show_hender?: boolean //是否显示头部操作按钮
  openthere?: string //那里引用的组件
  customHoverClass?: string //是否自定义悬浮效果 配合default-text-style 和 ellipsis: true,使用
  cacheScroll?: boolean // 是否缓存滚动位置
}
// 定义组件的 Emits 类型
interface SimpleTableEmits {
  (e: 'row-click', row: unknown, index: number, event: MouseEvent): void
  (e: 'page-change', pageInfo: { pageSize: number; current: number }): void
  (e: 'cell-click', row: unknown, col: PrimaryTableCol): void
  (e: 'sort-change', sort: TableSort): void
  (e: 'drag-sort', context: unknown): void
  (e: 'handleChange', pageInfo: PageInfo): void
  (e: 'SelectChange', data: Array<string>, _ctx: SelectOptions<TableRowData>): void
  (e: 'reqTable', data: ReqForm, type: string): void
  (e: 'handleReset', formdata?: any, type?: boolean): void
  (e: 'submit_reqTable', data?: any): void
  (e: 'saveConfig', config: any): void
  (e: 'SelectData', data: Array<TableRowData>): void
  (e: 'handleSelectHigh', data: any): void
  (e: 'scroll', data: any): void
}
// 定义组件的 Props
const props = withDefaults(defineProps<SimpleTableProps>(), {
  tableConfig: () => ({
    data: [],
    columns: [],
    rowKey: 'id',
    searchKey: 'keywords',
    ishighSearch: false,
    prompt: false,
    isShowSearch: true,
    isCustomHeader: false,
    showColumn: [],
    closeoperation: true,
    maxPageBtn: 10,
    rowClassName: '',
  }),
  stripe: false,
  bordered: true,
  hover: true,
  isReduceHeight: true,
  tableLayout: 'fixed',
  size: 'medium',
  showHeader: true,
  pagination: undefined,
  loading: false,
  cellEmptyContent: '-',
  resizable: true,
  dragSort: undefined, //row
  reduceheight: '180px',
  maxHeight: '100%',
  showpage: true,
  showpageForever: false,
  activeRowType: undefined,
  selectedRowKeys: () => [],
  SelecteddataIDs: () => [],
  reserveSelectedRowOnPaginate: false,
  total: 0,
  reducemaxHeight: '290px',
  isreqTable: true,
  filterNumber: 0,
  pageSizeOptions: [30, 50, 100],
  totalContent: true,
  show_hender: true,
  openthere: '',
  customHoverClass: '',
  cacheScroll: true,
})
// 是否显示分页
const shouldShowPagination = computed(() => {
  return props.showpageForever || (props.showpage && computedTotal.value > 0)
})
// 定义组件的 Emits
const emit = defineEmits<SimpleTableEmits>()
// 计算属性：确保tableConfig有默认值
const safeTableConfig = computed(() => ({
  rowKey: 'id',
  searchKey: 'keyword',
  isShowFilter: true,
  ishighSearch: false,
  prompt: false,
  isShowSearch: true,
  searchwidth: '310px',
  ...props.tableConfig,
}))
const reqForm = reactive({
  [safeTableConfig.value.searchKey]: '',
  pageIndex: props.pageParams?.pageIndex || 1,
  pageSize: props.pageParams?.pageSize || 30,
})
// 监听分页参数变化
watch(
  () => props.pageParams,
  () => {
    Object.assign(reqForm, props.pageParams)
  },
  {
    deep: true,
  }
)
//触发请求
const reqTable = (val?: any) => {
  reqForm.pageIndex = 1
  if (val) {
    reqForm[safeTableConfig.value.searchKey] = val
  }
  emit('reqTable', reqForm, 'search')
}
const submit_reqTable = (val?: any) => {
  reqForm.pageIndex = 1
  if (props.isreqTable) {
    if (val) {
      Object.assign(reqForm, val)
    }
    emit('reqTable', reqForm, 'search')
  } else {
    emit('submit_reqTable', val)
  }
}
//处理高频筛选
const highSearchRef = useTemplateRef('highSearch')
const getHighList = (item: any) => {
  let highList: any = []
  if (item.size) {
    highList = Array.from(item.values())
  } else {
    highList = []
  }
  emit('handleSelectHigh', highList)
}
// 清空高频筛选
const clearHighList = () => {
  highSearchRef.value?.handleClearAll()
}
// 处理重置事件
const handleReset = (formdata: any, type?: boolean) => {
  emit('handleReset', formdata, type)
}
// 处理行点击事件
const _handleRowClick: TableProps['onRowClick'] = (context) => {
  const { row, index, e } = context
  emit('row-click', row, index, e as MouseEvent)
}
// 处理单元格点击事件
const _handleCellClick: TableProps['onCellClick'] = (context) => {
  const { row, col } = context
  emit('cell-click', row, col)
}
// 处理分页变化
const _handlePageChange: TableProps['onPageChange'] = (context) => {
  emit('page-change', context)
}
// 处理选中项变化
const rehandleSelectChange: TableProps['onSelectChange'] = (value, _ctx) => {
  emit('SelectChange', value as Array<string>, _ctx)
}
const sortIcon = computed(() => {
  // 原业务实现为 TSX：() => <cb-icon name="sanjiaojiantou_xia" size="16px" />
  // 组件库 eslint（vue-eslint-parser）不解析 .vue script 内 JSX，改用 h() 渲染
  return () => h('cb-icon', { name: 'sanjiaojiantou_xia', size: '16px' })
})
const sortChange: TableProps['onSortChange'] = (sortVal) => {
  emit('sort-change', sortVal)
}
const onDragSort = (context: DragSortContext<TableRowData>) => {
  emit('drag-sort', context)
}
const handleChange = (pageInfo: PageInfo | any) => {
  emit('reqTable', reqForm, 'page')
  // { ...reqForm, ...pageInfo, pageIndex: pageInfo.current }
  emit('handleChange', pageInfo)
}
const computedTotal = computed(() => {
  return props.total || 0
})
const showColumnControl = ref(false)
const columnConfig = ref({
  visibleColumns: props.tableConfig.showColumn || [],
  columnOptions: [...props.tableConfig.columns],
})
watch(
  () => props.tableConfig,
  () => {
    columnConfig.value = {
      visibleColumns: props.tableConfig.showColumn || [],
      columnOptions: [...props.tableConfig.columns],
    }
  }
)
const currentColumns = computed(() => {
  return props.tableConfig.columns
    .filter((col) => columnConfig.value.visibleColumns.includes(col.colKey))
    .sort((a, b) => {
      const indexA = columnConfig.value.columnOptions.findIndex(
        (opt: any) => opt.colKey === a.colKey
      )
      const indexB = columnConfig.value.columnOptions.findIndex(
        (opt: any) => opt.colKey === b.colKey
      )
      return indexA - indexB
    })
})
const handleSaveConfig = (config: any) => {
  console.log(config, 'config')
  emit('saveConfig', config)
}
// 清空输入框数据
const clearInput = () => {
  reqForm[safeTableConfig.value.searchKey] = ''
}
// 重置页码 等于1
const resetPageIndex = () => {
  reqForm.pageIndex = 1
}
// ---- 滚动位置缓存 ----
const savedScrollTop = ref(0)
const tableRootEl = ref<HTMLElement | null>(null)
const getScrollEl = () =>
  tableRootEl.value?.querySelector('.t-table__content') as HTMLElement | null
const restoreScroll = async () => {
  await nextTick()
  const el = getScrollEl()
  if (el) el.scrollTop = savedScrollTop.value
}
// 通过 $attrs 透传的 scroll 事件记录位置，同时内部也直接监听
const _handleScroll = (params: { e: WheelEvent }) => {
  if (props.cacheScroll) {
    savedScrollTop.value = (params.e.target as HTMLElement).scrollTop
  }
  emit('scroll', params)
}
// 数据更新后恢复（覆盖数据刷新导致的 scrollTop 归零）
watch(
  () => props.tableConfig.data,
  () => {
    if (props.cacheScroll && savedScrollTop.value > 0) {
      restoreScroll()
    }
  }
)
// activated 时立即恢复，消除顶部闪烁
onActivated(() => {
  if (props.cacheScroll) {
    restoreScroll()
  }
})
defineExpose({
  reqForm,
  clearHighList,
  clearInput,
  resetPageIndex,
})
</script>
<style scoped lang="scss">
.public-table {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  gap: 16px;
  :deep(.t-table--layout-fixed) {
    height: 100%;
  }
  :deep(.t-table) {
    height: 100%;
    // border-color: rgba(230, 230, 230, 0.7) !important;
    // .t-table__content {
    //   border-color: rgba(230, 230, 230, 0.7) !important;
    // }
    // .t-table__header {
    //   tr,
    //   th {
    //     outline-color: rgba(230, 230, 230, 0.7) !important;
    //   }
    // }
    // .t-table__body {
    //   tr,
    //   td {
    //     outline-color: rgba(230, 230, 230, 0.7) !important;
    //   }
    // }
    .t-table__double-icons {
      position: absolute;
      width: 16px;
      height: 32px;
    }
    .t-table-sort-asc {
      position: absolute;
      top: 4px;
      left: 50%;
      transform: translateX(-48%) rotate(180deg);
    }
    .t-table-sort-desc {
      position: absolute;
      bottom: 4px;
      left: 50%;
      transform: translateX(-50%) rotate(0deg);
    }
    .t-table__sort-icon {
      height: 16px;
      width: 16px !important;
      text-align: center;
    }
    .t-table__header {
      tr {
        background: #f6f8fa;
        th {
          color: #333333;
          background-color: #f6f8fa;
          font-size: 14px;
          font-family: 'DemiBold', sans-serif;
        }
      }
    }
    &:not(.t-table--striped) {
      .t-table__footer > tr {
        background-color: #f6f8fa;
      }
    }
    .t-table__content {
      th,
      td {
        padding: 10px 8px !important;
        color: var(--td-text-color-6);
      }
    }
    .t-table__footer {
      tr,
      td {
        color: #000;
        font-size: 14px;
        font-weight: 600;
      }
    }
    .t-table__body {
      tr {
        td {
          border: none;
          outline-color: var(--td-component-border);
          outline-style: solid;
          outline-width: 1px;
        }
      }
    }
    .t-table__header {
      tr {
        th {
          border: none;
          outline-color: var(--td-component-border);
          outline-style: solid;
          outline-width: 1px;
        }
      }
    }
  }
  .CBPagination {
    margin-bottom: 10px;
  }
  .table_box {
    height: 0px;
    flex-grow: 1;
  }
  :deep(.custom-hover-class) {
    tbody {
      tr {
        transition: background-color 0.2s linear;
        &:hover {
          background-color: #f6f8fa;
          .default-text-style {
            border: 1px solid var(--td-brand-color);
            border-radius: 2px;
            padding: 0px 7px !important;
            line-height: 30px;
            background-color: #fff;
          }
        }
        .t-table__ellipsis {
          height: 100%;
          line-height: 32px;
          .default-text-style {
            height: 100%;
          }
        }
      }
    }
  }
}
</style>
