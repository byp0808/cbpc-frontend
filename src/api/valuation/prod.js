import request from '@/utils/app-request'
import { basic_api_valuation, basic_api_market } from '@/api/base-api.js'

// 保存估值产品配置信息
export function saveProd(data) {
  return request({
    url: `${basic_api_valuation}/prod/save`,
    method: 'post',
    data
  })
}

// 查询基础产品指标信息
export function queryBasicProdIndex(data) {
  return request({
    url: `/basic-prod/indices`,
    method: 'post',
    data
  })
}
// 估值方法
export function queryValuationWay(data) {
  return request({
    url: `/valuation/way`,
    method: 'post',
    data
  })
}
// 估值方法
export function queryBatches(data) {
  return request({
    url: `/batch/list`,
    method: 'post',
    data
  })
}
