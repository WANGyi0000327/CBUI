/**
 * CB UI 组件库全量入口
 * ------------------------------------------------------------
 * 该文件由 scripts/generate-index.mjs 自动生成，请勿手动修改
 * 重新生成命令：pnpm gen:index
 */

import type { App } from 'vue'

// 导入组件
import { CbAudioPlayer } from './audio-player'
import { Button } from './button'
import { ButtonFold } from './button-fold'
import { ColControl } from './col-control'
import { CollapseSidebar } from './collapse-sidebar'
import { ColumnControl } from './column-control'
import { CommonDialog } from './common-dialog'
import { Copy } from './copy'
import { CountUpNumber } from './count-up-number'
import { CurrencyInput } from './currency-input'
import { DateRangeConfirmPicker } from './date-range-confirm-picker'
import { GridLayout } from './grid-layout'
import { Icon } from './icon'
import { ImageSecret } from './image-secret'
import { MorePopup } from './more-popup'
import { MultipleSelect } from './multiple-select'
import { NumericInput } from './numeric-input'
import { OverBtns } from './over-btns'
import { OverLimitInputNumber } from './over-limit-input-number'
import { OverflowInput } from './overflow-input'
import { PageLayout } from './page-layout'
import { Pagination } from './pagination'
import { PreviewImage } from './preview-image'
import { RenderComponent } from './render-component'
import { Search } from './search'
import { SearchFilter } from './search-filter'
import { SearchInput } from './search-input'
import { StatusTag } from './status-tag'
import { Tabs } from './tabs'
import { TagBar } from './tag-bar'
import { TagImg } from './tag-img'
import { Tags } from './tags'
import { TimeSelect } from './time-select'
import { TimeSelectLine } from './time-select-line'
import { VoiceToText } from './voice-to-text'

// 导入指令（v-click-outside 等，供 CbDateRangeConfirmPicker 等组件使用）
import { clickOutside as vClickOutside } from './directives/clickOutside'

// 导出组件
export { CbAudioPlayer, Button, ButtonFold, ColControl, CollapseSidebar, ColumnControl, CommonDialog, Copy, CountUpNumber, CurrencyInput, DateRangeConfirmPicker, GridLayout, Icon, ImageSecret, MorePopup, MultipleSelect, NumericInput, OverBtns, OverLimitInputNumber, OverflowInput, PageLayout, Pagination, PreviewImage, RenderComponent, Search, SearchFilter, SearchInput, StatusTag, Tabs, TagBar, TagImg, Tags, TimeSelect, TimeSelectLine, VoiceToText }

// 导出类型
export type { AudioPlayerProps } from './audio-player'
export type { ButtonProps, ButtonEmits, ButtonSlots, ButtonType, ButtonSize, ButtonNativeType } from './button'
export type { ButtonFoldProps, ButtonFoldType } from './button-fold'
export type { CbColControlProps, ColControlColumn } from './col-control'
export type { CbCollapseSidebarProps } from './collapse-sidebar'
export type { TableColumn, ColumnOption, ColumnConfig, ColumnControlProps } from './column-control'
export type { BaseDialogProps } from './common-dialog'
export type { CopyProps } from './copy'
export type { CountUpNumberProps } from './count-up-number'
export type { CurrencyInputProps, CurrencyInputInstance } from './currency-input'
export type { DateRangeConfirmPickerProps, DateRangeConfirmPickerEmits } from './date-range-confirm-picker'
export type { GridLayoutProps } from './grid-layout'
export type { IconProps } from './icon'
export type { ImageSecretProps } from './image-secret'
export type { MorePopupProps, MorePopupEmits, MorePopupSlots } from './more-popup'
export type { MultipleSelectProps } from './multiple-select'
export type { NumericInputProps, NumericInputEmits } from './numeric-input'
export type { OverBtnsProps, OverBtn, OverRow } from './over-btns'
export type { OverLimitInputNumberProps, OverLimitInputNumberEmits } from './over-limit-input-number'
export type { OverflowInputProps } from './overflow-input'
export type { CbPageLayoutInstance } from './page-layout'
export type { PaginationProps } from './pagination'
export type { PreviewImageProps } from './preview-image'
export type { RenderComponentProps, RenderComponentEmits } from './render-component'
export type { CBSearchProps } from './search'
export type { SearchFilterProps, FormItem } from './search-filter'
export type { SearchInputProps } from './search-input'
export type { tagType } from './status-tag'
export type { CbTabsProps, typeTab } from './tabs'
export type { CbTagBarProps, TagBarTab } from './tag-bar'
export type { TagImgProps } from './tag-img'
export type { CbTagsProps } from './tags'
export type { CbTimeSelectProps, TimeFilterValue, TimeFilterArrayValue } from './time-select'
export type { CbTimeSelectLineProps, MonthItem } from './time-select-line'
export type { AudioTranscriptHookProps, TranscriptItem } from './voice-to-text'

// 导出 Resolver（用于按需加载）
export { CBUIResolver } from './resolver'
export type { CBUIResolverOptions, ComponentResolver } from './resolver'

const components = [CbAudioPlayer, Button, ButtonFold, ColControl, CollapseSidebar, ColumnControl, CommonDialog, Copy, CountUpNumber, CurrencyInput, DateRangeConfirmPicker, GridLayout, Icon, ImageSecret, MorePopup, MultipleSelect, NumericInput, OverBtns, OverLimitInputNumber, OverflowInput, PageLayout, Pagination, PreviewImage, RenderComponent, Search, SearchFilter, SearchInput, StatusTag, Tabs, TagBar, TagImg, Tags, TimeSelect, TimeSelectLine, VoiceToText]

export const CBUI = {
  install(app: App) {
    components.forEach((component) => {
      const name = (component as { name?: string }).name || (component as { __name?: string }).__name || ''
      if (name) {
        app.component(name, component)
      }
    })
    // 全局注册 v-click-outside 指令（CbDateRangeConfirmPicker 等组件依赖）
    app.directive('click-outside', vClickOutside)
    // 自动初始化 iconfont SVG Sprite
    import('./assets/iconfont/initIconfont').then(({ initIconfont }) => {
      initIconfont()
    })
  },
}
