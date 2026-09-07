/**
 * CbSearchFilter 筛选弹层组件类型
 * ----------------------------------------------------------------
 * 基于 TDesign t-popup + t-form 封装：点击"筛选"按钮弹出表单面板，
 * 通过 list 配置动态渲染 input / select / radio / checkbox /
 * dateRangePicker / cascader 字段，支持重置（还原初始值/清空）与
 * 提交校验，v-model:visible 控制弹层显隐。
 */

/**
 * 动态表单字段配置
 */
export interface FormItem {
  /**
   * 字段标签
   */
  label: string
  /**
   * 字段名，用于数据绑定（formData 的 key）
   */
  name: string
  /**
   * 字段类型
   */
  type:
    | 'input'
    | 'select'
    | 'radio'
    | 'checkbox'
    | 'dateRangePicker'
    | 'cascader'
  /**
   * 占位符（输入框）
   */
  placeholder?: string
  /**
   * 选项（select / radio / checkbox / cascader）
   */
  options?: Array<{ label: string; value: string | number }>
  /**
   * 是否必填
   */
  required?: boolean
  /**
   * 字段宽度
   */
  width?: string
  /**
   * 透传给 t-date-range-picker 的额外配置
   */
  config?: Record<string, unknown>
  /**
   * 是否多选（select / cascader）
   */
  multiple?: boolean
  /**
   * 选项字段映射（select）
   */
  keys?: Record<string, string>
}

/**
 * CbSearchFilter 筛选弹层组件属性
 */
export interface SearchFilterProps {
  /**
   * 动态表单字段配置列表
   */
  list?: FormItem[]
  /**
   * 弹层内容宽度
   * @default 'auto'
   */
  popupwidth?: string
  /**
   * 当前筛选条件数量（>0 时按钮显示主题色与数量角标）
   * @default 0
   */
  filterNumber?: number
  /**
   * 筛选按钮最小宽度
   */
  btnWidth?: string
  /**
   * 初始表单数据（提交/重置还原的基础值）
   */
  filterForm?: Record<string, unknown>
  /**
   * 是否显示合计（预留）
   * @default false
   */
  showTotal?: boolean
  /**
   * 合计数量（预留）
   * @default 0
   */
  total?: number
  /**
   * 关闭弹层时是否销毁内容
   * @default false
   */
  destroyOnClose?: boolean
  /**
   * 表单初始数据（onMounted 时作为重置基准值）
   */
  formDataProp?: Record<string, unknown>
  /**
   * t-form 校验规则
   */
  formRules?: Record<string, unknown>
  /**
   * 是否隐藏按钮背景色
   * @default false
   */
  hide?: boolean
}
