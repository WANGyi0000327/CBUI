export interface PageInfo {
  pageIndex: number
  pageSize: number
}
export interface HighSearchItem {
  label: string
  value: string
  id?: string
  code?: string
  labelCode: string
  labelName: string
  labelId: string
  [key: string]: any
}
export interface ReqForm {
  [key: string]: any
  pageIndex: number
  pageSize: number
}
// 筛选列表项（业务中定义于公共筛选组件，此处为组件自足补充）
export interface SearchItem {
  label: string
  value: string
  [key: string]: any
}
export interface ConfigType {
  data: any[] //表格数据
  searchKey?: string //关键字key
  searchPlaceholder?: string //搜索框占位符
  ishighSearch?: boolean //是否显示高频搜索
  columns: any[] //表格列配置
  rowKey?: string //行key
  highSearchList?: Array<HighSearchItem> //高频搜索列表
  isShowSearch?: boolean //是否显示搜索栏
  filterList?: Array<SearchItem> //筛选列表
  popupwidth?: string //弹出框宽度
  isCustomHeader?: boolean //是否自定义表头
  showColumn: Array<string> //显示列配置
  closeoperation: boolean //关闭操作按钮
  maxPageBtn?: number //最大页码按钮数
  rowClassName?: string
}
