<template>
  <t-popup
    v-model:visible="visible"
    overlay-class-name="filter-container"
    trigger="click"
    placement="bottom-left"
    :destroy-on-close="destroyOnClose"
    v-bind="$attrs"
  >
    <template #content>
      <div class="cover-scrollbar py-[16px]" :style="{ width: popupwidth }">
        <div class="overflow-y-scroll size-full pl-[16px] px-[16px]" style="max-height: 50vh">
          <t-form
            ref="formRef"
            label-align="top"
            :data="formData"
            :rules="formRules"
            reset-type="initial"
          >
            <slot v-if="$slots.content" name="content"></slot>
            <!-- 动态渲染表单字段 -->
            <template v-if="list && list.length">
              <div
                v-for="item in list"
                :key="item.name"
                style="margin-bottom: 24px"
                :style="{ width: item.width || '100%' }"
              >
                <t-form-item :label="item.label" :name="item.name" :required="item.required">
                  <!-- 输入框 -->
                  <t-input
                    v-if="item.type === 'input'"
                    v-model="formData[item.name]"
                    :placeholder="item.placeholder || ''"
                  />
                  <!-- 下拉框 -->
                  <t-select
                    v-else-if="item.type === 'select'"
                    v-model="formData[item.name]"
                    :options="item.options || []"
                    placeholder="请选择"
                    :min-collapsed-num="1"
                    :multiple="item.multiple"
                    :keys="item.keys"
                  />
                  <!-- 单选框组 -->
                  <t-radio-group v-else-if="item.type === 'radio'" v-model="formData[item.name]">
                    <t-radio
                      v-for="option in item.options || []"
                      :key="option.value"
                      :value="option.value"
                    >
                      {{ option.label }}
                    </t-radio>
                  </t-radio-group>
                  <!-- 多选框组 -->
                  <t-checkbox-group
                    v-else-if="item.type === 'checkbox'"
                    v-model="formData[item.name]"
                  >
                    <t-checkbox
                      v-for="option in item.options || []"
                      :key="option.value"
                      :value="option.value"
                    >
                      {{ option.label }}
                    </t-checkbox>
                  </t-checkbox-group>
                  <!-- 时间区间选择 -->
                  <t-date-range-picker
                    v-else-if="item.type === 'dateRangePicker'"
                    v-model="formData[item.name]"
                    allow-input
                    clearable
                    v-bind="item?.config"
                  >
                  </t-date-range-picker>
                  <!-- 级联选择 -->
                  <t-cascader
                    v-else-if="item.type === 'cascader'"
                    v-model="formData[item.name]"
                    :options="item.options"
                    :show-all-levels="false"
                    :multiple="item.multiple"
                    :min-collapsed-num="1"
                  />
                  <!-- 树选择 -->
                </t-form-item>
              </div>
            </template>
          </t-form>
        </div>
        <div class="flex justify-end gap-[8px] mt-[8px] px-[16px]">
          <!-- <t-button theme="default" @click="handleClose">取消</t-button> -->
          <t-button theme="default" @click="handleReset(false)">重置</t-button>
          <t-button theme="primary" @click="handleQuery">确定</t-button>
        </div>
      </div>
    </template>
    <t-button
      :style="btnWidth ? { minWidth: btnWidth } : {}"
      :class="{
        'btn-normal': filterNumber === 0,
        hideBg: hide,
      }"
      :theme="filterNumber > 0 ? 'cb-brand-default' : ''"
    >
      <div class="flex items-center">
        <cb-icon name="shaixuan" class="mr-[6px]" />
        筛选
        <span v-if="filterNumber > 0">
          ({{ filterNumber }})
          <cb-icon
            name="guanbi"
            color="var(--td-brand-color)"
            class="cursor-pointer"
            @click.stop="handleReset(true)"
          ></cb-icon>
        </span>
      </div>
    </t-button>
  </t-popup>
</template>
<script setup lang="ts">
import { deepClone } from '@cb-ui/utils'
import type { FormRules, FormValidateParams } from 'tdesign-vue-next'
import { ref, onMounted } from 'vue'
// 表单字段配置类型定义
interface FormItem {
  keys?: any
  label: string // 字段标签
  name: string // 字段名，用于数据绑定
  type: 'input' | 'select' | 'radio' | 'checkbox' | 'dateRangePicker' | 'cascader' // 字段类型
  placeholder?: string // 占位符（输入框）
  options?: Array<{ label: string; value: string | number }> // 选项（下拉框、单选框、多选框）
  required?: boolean // 是否必填
  width?: string // 宽度（可选）
  config?: any
  multiple?: boolean // 是否多选（级联选择）
}
defineOptions({
  name: 'CbSearchFilter',
})
const emits = defineEmits(['reset', 'submit', 'cancel'])
const formRef = ref()
const props = withDefaults(
  defineProps<{
    list?: FormItem[]
    popupwidth?: string
    filterNumber?: number
    btnWidth?: string
    filterForm?: Record<string, unknown>
    showTotal?: boolean
    total?: number
    destroyOnClose?: boolean
    formDataProp?: any
    formRules?: FormRules
    hide?: boolean
  }>(),
  {
    list: () => [],
    popupwidth: 'auto',
    filterNumber: () => 0,
    showTotal: false,
    total: 0,
    filterForm: () => ({}),
    destroyOnClose: () => false,
    hide: () => false,
  }
)
const searchIng = ref(false)
const setFieldsValueDefault = () => {
  const { list } = props || {}
  const values: any = ref({})
  list.forEach((item) => {
    if (
      item.type === 'dateRangePicker' ||
      (item.type === 'select' && item.multiple) ||
      item.type === 'checkbox' ||
      (item.type === 'cascader' && item.multiple)
    ) {
      values.value[item.name] = []
    } else {
      values.value[item.name] = ''
    }
  })
  return values.value
}
const formData = ref<Record<string, any>>(
  props.formDataProp ? deepClone(props.formDataProp) : setFieldsValueDefault() || {}
)
const visible = defineModel('visible', {
  default: false,
})
let initPropFormDate: any = null
const handleReset = (type = false) => {
  // 重置
  if (!type) {
    formData.value = initPropFormDate ? deepClone(initPropFormDate) : setFieldsValueDefault() || {}
    // 清除
  } else {
    formData.value = setFieldsValueDefault() || {}
  }
  emits('reset', formData.value, type)
}
const handleQuery = async () => {
  const valid = await validate()
  if (!valid) return
  searchIng.value = true
  emits('submit', formData.value)
  visible.value = false
}
const validate = async (params?: FormValidateParams) => {
  const res = await formRef.value?.validate(params)
  return res === true
}
const clearValidate = () => {
  formRef.value?.clearValidate?.()
}
defineExpose({ validate, clearValidate })
onMounted(() => {
  if (props.formDataProp) {
    initPropFormDate = deepClone(props.formDataProp)
    formData.value = deepClone(props.formDataProp)
  }
})
</script>
<style scoped lang="scss">
.hideBg {
  background: #ffffff !important;
}
.formflex {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.cb-search-filter-style {
  padding: 0 !important;
  :deep(.t-button__text) {
    height: 100%;
  }
  .cb-search-filter-style {
    padding: 0 !important;
    :deep(.t-button__text) {
      height: 100%;
    }
  }
  .btn-normal {
    border: 1px solid #e6e6e6;
    color: #666666;
    background-color: #ffffff;
    &:hover {
      border: 1px solid #e6e6e6;
      color: #666666;
      background-color: #ffffff;
    }
  }
}
</style>
<style lang="scss">
.filter-container {
  .t-popup__content {
    min-width: 380px;
    padding: 0 !important;
  }
}
//滚动条
.cover-scrollbar ::-webkit-scrollbar {
  width: 4px !important;
}
.cover-scrollbar ::-webkit-scrollbar-thumb {
  background-color: rgba(144, 147, 153, 0.2) !important;
}
</style>
