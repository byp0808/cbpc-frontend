import request from '@/utils/app-request'
import { basic_api_market } from '@/api/base-api'

// 查询曲线行情
export function queryBondsMarket(data) {
  return request({
    url: `${basic_api_market}` + '/market/query',
    method: 'post',
    data: data
  })
}
