/**
 *  码值临时数据
 *    add by nohi 20190910
  */
// 审批状态
export const APPROVE_SATAUS = [
  { value: '01', label: '待审批/待审核' },
  { value: '02', label: '通过' },
  { value: '03', label: '拒绝' }
]

// 产品状态
export const CURVE_PRODCUT_SATAUS = [
  { value: '1', label: '待售' },
  { value: '2', label: '在售' },
  { value: '3', label: '停产' },
  { value: '4', label: '退市' }
]

// 产品线
export const PRODUCT_LINE = [
  { value: 'CBP', label: '中债估值' },
  { value: 'CB', label: '中债收益率曲线' }
]

// 产品组
export const PRODUCT_GROUP = [
  { value: 'CB', label: '收益率曲线', parent: 'CB' },
  { value: 'CBPB', label: '债权类估值', parent: 'CBP' }
]

// 基础产品线
export const BASE_PRD_CODE = [
  { value: '0017', label: '收益率曲线', parent: 'CB' },
  { value: '0018', label: '收益率曲线样本券', parent: 'CB' },
  { value: '0019', label: '市场利率曲线', parent: 'CB' },
  { value: '0001', label: '中债估值', parent: 'CBPB' }
]

// 市场
export const CODE_TYPE_MARKET = [
  { value: '01', label: '中国镜内银行间市场' },
  { value: '02', label: '香港' },
  { value: '03', label: '巴黎' },
  { value: '04', label: '纽约' }
]

// 日历
export const CODE_TYPE_CALENDAR = [
  { value: '01', label: '中国镜内银行间市场日历' },
  { value: '02', label: '香港日历' },
  { value: '03', label: '巴黎日历' },
  { value: '04', label: '纽约日历' }
]

// 币种
export const CURRENCY = [
  { value: '01', label: '人民币' },
  { value: '02', label: '美元' },
  { value: '03', label: '英镑' },
  { value: '04', label: '日元' }
]

// 利率类型
export const RATE_TYPE = [
  { value: '01', label: '固定利率' },
  { value: '02', label: '浮动利率' }
]

// 曲线基准利率
export const REFER_RATE = [
  { value: '01', label: '中国国债收益率曲线' },
  { value: '02', label: '中国国债收益率曲线2' },
  { value: '03', label: '中国国债收益率曲3' }
]
// 曲线编制类型
export const CURVE_BUILD_TYPE = [
  { value: '01', label: '利率' },
  { value: '02', label: '信用' }
]
// 曲线价格源
export const CURVE_PRICE_FR = [
  { value: '01', label: '估值' },
  { value: '02', label: '行情' }
]

// 该批次所需模型
export const MODEL = [
  { value: '1', label: 'hermite模型' },
  { value: '2', label: '样条模型', disabled: true },
  { value: '3', label: 'NS模型', disabled: true }
]

// 该批次所需编制方式
export const BUILD_TYPE = [
  { value: '1', label: '人工干预编制' },
  { value: '2', label: '自动编制' }
]

// 该批次所需计算方式
export const COMPUTED_TYPE = [
  { value: '1', label: '人工干预计算' },
  { value: '2', label: '自动计算' }
]

// 该批次所需发布方式
export const PUBLISH_TYPE = [
  { value: '1', label: '人工干预发布' },
  { value: '2', label: '自动发布' }
]

// 曲线发布类型
export const CURVEPUB_TYPE = [
  { value: '1', label: '到期' },
  { value: '2', label: '即期' },
  { value: '3', label: '远期' }
]
// 发布步长
export const PUBLISH_STEP_SIZE = [
  { value: '1', label: '0.01' },
  { value: '2', label: '0.1' },
  { value: '3', label: '0.2' },
  { value: '4', label: '0.5' }
]

// 付息频率
export const INTEREST_DUE_FREQ = [
  { value: '1', label: '一年一次' },
  { value: '2', label: '一年两次' },
  { value: '3', label: '一年四次' },
  { value: '4', label: '一年次十二次' }
]

// 自动编制规则
export const AUTO_RULE = [
  { value: '1', label: '中债自动编制规则' }
]
// 是否
export const Y_OR_N = [
  { value: 'Y', label: '是' },
  { value: 'N', label: '否' }
]

// 曲线编制状态
export const CURVE_BUILD_STATUS = [
  { value: '1', label: '已发布' }
]

// 计算历史分位点，类型
export const COMPUTE_HISINDEX = [
  { value: '1', label: '自曲线发布以来' },
  { value: '2', label: '最近' }
]

// 计算历史分位点，日期类型
export const COMPUTE_HIS_DATE = [
  { value: '1', label: '1个月' },
  { value: '2', label: '2个月' },
  { value: '3', label: '3个月' }
]

// 关键期限
export const STAND_SLIP = [
  { value: '0.01', label: '0.01' },
  { value: '0.08', label: '0.08' },
  { value: '0.24', label: '0.24' },
  { value: '0.5', label: '0.5' },
  { value: '1', label: '1' }
]
