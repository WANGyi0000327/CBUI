/**
 * 商品卡片组件属性
 */

/**
 * 商品列表数据项
 */
export interface ProductHallListType {
  /** 是否已加购 */
  addCar: boolean
  /** 分类 ID */
  classId: number
  /** 分类名称 */
  className: string
  /** 当月销量 */
  currentMonthSales: number
  /** 商品 ID */
  id: number
  /** 上月销量 */
  lastMonthSales: number
  /** 主图 URL */
  mainImg: string
  /** 最低价 */
  minPrice: number
  /** 最高价 */
  maxPrice: number
  /** 环比 */
  monthOverMonth: number
  /** 商品名称 */
  productName: string
  /** 商品类型 */
  productType: number
  /** 商品类型描述 */
  productTypeDesc: string
  /** 总销量 */
  totalSales: number
  /** 来源 */
  source?: string
}

/**
 * 商品卡片 Props
 */
export interface CardProps {
  /**
   * 宽度溢出补偿（px），用于容器 padding 计算
   * @default 0
   */
  overWidth?: number

  /**
   * 生产墙 ref 引用（保留兼容，暂未使用）
   * @default () => {}
   */
  productionWallRef?: unknown

  /**
   * 是否显示签单按钮
   * @default true
   */
  issignorder?: boolean

  /**
   * 是否显示加购按钮
   * @default true
   */
  isbugcart?: boolean

  /**
   * 商品数据
   */
  items?: ProductHallListType

  /**
   * 卡片最小宽度（px）
   */
  minCardWidth?: number

  /**
   * 图片区域固定高度（CSS 值）
   * @default '220px'
   */
  height?: string

  /**
   * 是否自适应图片高度（高 = (宽-24) * 0.54）
   * @default false
   */
  adaptive?: boolean

  /**
   * 是否显示下架遮罩
   * @default false
   */
  isShowOffLine?: boolean
}

/**
 * 加购事件回调参数
 */
export interface AddCartEventPayload {
  type: string
  productType: number
  productId: number
  productLogo: string
  productName: string
  source?: string
  addCar: boolean
}

/**
 * 商品卡片事件
 */
export interface CardEmits {
  /**
   * 加购按钮点击
   * @param payload 加购数据
   */
  addcart: [payload: AddCartEventPayload]

  /**
   * 签单按钮点击
   */
  signorder: []

  /**
   * resize 回调（保留兼容）
   */
  resizeHanlder: []

  /**
   * 卡片点击
   * @param id 商品 ID
   * @param productType 商品类型
   */
  click: [id: number | undefined, productType: number | undefined]
}

/**
 * 商品卡片插槽
 */
export interface CardSlots {
  /**
   * 默认内容
   */
  default: () => unknown
}
