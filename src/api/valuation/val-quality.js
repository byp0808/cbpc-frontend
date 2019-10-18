import request from '@/utils/app-request'

const basic_api_valuation = '/pi-valuation'

// 查询估值产品总览质检报告
export function qryOverallQcRpt(data) {
  return request({
    url: `${basic_api_valuation}` + '/vql/quality/qryOverallQcRpt',
    method: 'post',
    data: data
  })
}

// 查询估值产品入库变动质检报告
export function qryValNumChgQcRpt(data) {
  return request({
    url: `${basic_api_valuation}` + '/vql/quality/qryValNumChgQcRpt',
    method: 'post',
    data: data
  })
}

// 查询估值产品净价波动质检报告
export function qryValNetPrcShkQcRpt(data) {
  return request({
    url: `${basic_api_valuation}` + '/vql/quality/qryValNetPrcShkQcRpt',
    method: 'post',
    data: data
  })
}

// 查询估值产品收益率波动质检报告
export function qryValYieldShkQcRpt(data) {
  return request({
    url: `${basic_api_valuation}` + '/vql/quality/qryValYieldShkQcRpt',
    method: 'post',
    data: data
  })
}

// 查询估值产品应计利息报警质检报告
export function qryValAccIntrstAlertQcRpt(data) {
  return request({
    url: `${basic_api_valuation}` + '/vql/quality/qryValAccIntrstAlertQcRpt',
    method: 'post',
    data: data
  })
}

// 查询估值产品容错质检报告
export function qryValFTQcRpt(data) {
  return request({
    url: `${basic_api_valuation}` + '/vql/quality/qryValFTQcRpt',
    method: 'post',
    data: data
  })
}

// 查询估值产品成本法（净价为100）质检报告
export function qryValNetPrcQcRpt(data) {
  return request({
    url: `${basic_api_valuation}` + '/vql/quality/qryValNetPrcQcRpt',
    method: 'post',
    data: data
  })
}

// 查询估值产品估值为0质检报告
export function qryValValQcRpt(data) {
  return request({
    url: `${basic_api_valuation}` + '/vql/quality/qryValValQcRpt',
    method: 'post',
    data: data
  })
}

// 查询估值产品重复估值质检报告
export function qryReValQcRpt(data) {
  return request({
    url: `${basic_api_valuation}` + '/vql/quality/qryReValQcRpt',
    method: 'post',
    data: data
  })
}

// 查询估值曲线质检参数
export function qryValQcParm(data) {
  return request({
    url: `${basic_api_valuation}` + '/param/quality/qryValQcParm',
    method: 'post',
    data: data
  })
}

// 设置估值质检参数
export function setValQcParm(data) {
  return request({
    url: `${basic_api_valuation}` + '/param/quality/setValQcParm',
    method: 'post',
    data: data
  })
}
