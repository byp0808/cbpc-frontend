import request from '@/utils/app-request'
import { basic_api_valuation } from '@/api/base-api.js'

// 批量计算列表
export function cmptBatchList(data) {
  return request({
    url: `${basic_api_valuation}/cmpt/batch-list`,
    method: 'post',
    data
  })
}

// 批量计算
export function cmptBatch(data) {
  return request({
    url: `${basic_api_valuation}/cmpt/batch-cmpt`,
    method: 'post',
    data
  })
}
