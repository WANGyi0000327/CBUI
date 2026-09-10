// 动态表单字段类型定义
// 用户源码原样保留（FormValue / FormValues / FormField / DynamicFormProps），
// 并补齐其引用的辅助类型（LabelRenderFunction / ContentRenderFunction / FieldType / FieldOption / ComponentProps / ValidationRule）
import type { VNode } from 'vue'

// 泛型表单值类型
export type FormValue =
  | string
  | number
  | boolean
  | Date
  | Array<string | number | boolean>
  | null
  | undefined
export interface FormValues {
  [key: string]: FormValue
}

// label 渲染函数（函数式渲染 label 时返回字符串或 VNode）
export type LabelRenderFunction = (field: FormField) => string | VNode
// content 渲染函数（自定义字段内容：接收 modelValue / field / onUpdate 回调，返回 VNode）
export type ContentRenderFunction = (params: {
  modelValue?: FormValue
  field?: FormField
  onUpdate: (value: FormValue) => void
}) => VNode

// 字段控件类型
export type FieldType =
  | 'input'
  | 'select'
  | 'checkbox'
  | 'radio'
  | 'date'
  | 'dateRange'
  | string

// 选项项（select / checkbox / radio 通用）
export interface FieldOption {
  label: string
  value: string | number | boolean
  [key: string]: any
}

// 透传给控件的组件属性
export type ComponentProps = Record<string, any>

// 校验规则（TDesign FormRule 的简化形式）
export type ValidationRule = Record<string, any>

// 字段配置泛型
export interface FormField<T = FormValue, K extends string = string> {
  key: K
  label: string | LabelRenderFunction
  content?: string | ContentRenderFunction
  type?: FieldType
  props?: ComponentProps
  options?: FieldOption[]
  rules?: ValidationRule[]
  hidden?: boolean
  disabled?: boolean
  // 条件显示
  showWhen?: (values?: FormValues) => boolean
}
// 泛型表单 Props
export interface DynamicFormProps<T extends FormValues = FormValues> {
  fields: Array<FormField<FormValue, keyof T & string>>
  modelValue: FormValues
}
