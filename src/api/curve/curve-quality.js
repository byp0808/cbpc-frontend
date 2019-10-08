import request from '@/utils/app-request'

const basic_api_curve = '/pi-curve'

// 查询曲线总览质检报告
export function qryCurveOverallQcRpt(data) {
  return request({
    url: `${basic_api_curve}` + '/cql/quality/qryCurveOverallQcRpt',
    method: 'post',
    data: data
  })
}

// 查询曲线总览数量
export function qryCurveOverallNum(data) {
  return request({
    url: `${basic_api_curve}` + '/cql/quality/qryCurveOverallNum',
    method: 'post',
    data: data
  })
}

// 查询曲线全面性质检报告
export function qryCurveComprehensiveQcRpt(data) {
  return request({
    url: `${basic_api_curve}` + '/cql/quality/qryCurveComprehensiveQcRpt',
    method: 'post',
    data: data
  })
}

// 查询曲线波动性质检报告
export function qryCurveShkQcRpt(data) {
  return request({
    url: `${basic_api_curve}` + '/cql/quality/qryCurveShkQcRpt',
    method: 'post',
    data: data
  })
}

// 查询曲线产品倒挂列表
export function qryCurveRvsQcList(data) {
  return request({
    url: `${basic_api_curve}` + '/cql/quality/qryCurveRvsQcList',
    method: 'post',
    data: data
  })
}

// 查询曲线产品倒挂质检报告
export function qryCurveRvsQcRpt(data) {
  return request({
    url: `${basic_api_curve}` + '/cql/quality/qryCurveRvsQcRpt',
    method: 'post',
    data: data
  })
}

// 查询曲线产品跨线质检报告
export function qryCurveCrsQcRpt(data) {
  return request({
    url: `${basic_api_curve}` + '/cql/quality/qryCurveCrsQcRpt',
    method: 'post',
    data: data
  })
}

// 查询曲线产品容错质检报告
export function qryCurveFTQcRpt(data) {
  return request({
    url: `${basic_api_curve}` + '/cql/quality/qryCurveFTQcRpt',
    method: 'post',
    data: data
  })
}
