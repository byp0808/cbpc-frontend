import request from '@/utils/request-client'
import { basic_api_valuation } from '@/api/base-api.js'

// 查询估值
export function queryValuation(data) {
  return request(
    {
      url: `${basic_api_valuation}/query/query-valuation`,
      method: 'post',
      data: data
    }
  )
}
// 查询估值点差方案
export function queryValuationScheme(data) {
  return request(
    {
      url: `${basic_api_valuation}/query/query-valuation-scheme`,
      method: 'post',
      data: data
    }
  )
}
// 查询人工估值
export function queryPeopleValuation(data) {
  return request(
    {
      url: `${basic_api_valuation}/query/query-people-valuation`,
      method: 'post',
      data: data
    }
  )
}
// 查询指定日期下的批次
export function getTaskBatchList(data) {
  return request(
    {
      url: `${basic_api_valuation}/query/task-batch-list`,
      method: 'post',
      data: data
    }
  )
}
