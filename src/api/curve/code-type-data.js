/**
 *  码值临时数据
 *    add by nohi 20190910
  */
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
  { value: '0019', label: '市场利率曲线', parent: 'CB' }
]

// 市场
export const MARKET = [
  { value: '01', label: '中国镜内银行间市场' },
  { value: '02', label: '香港' },
  { value: '03', label: '巴黎' },
  { value: '04', label: '纽约' }
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
  { value: '01', label: '中国镜内银行间市场日历' },
  { value: '02', label: '香港日历' },
  { value: '03', label: '巴黎日历' },
  { value: '04', label: '纽约日历' }
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
