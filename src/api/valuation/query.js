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
export function queryValuationScheme() {
  return request(
    {
      url: `${basic_api_valuation}/query/query-valuation-scheme`,
      method: 'post'
    }
  )
}
