import request from '@/utils/app-request'
import { basic_api_market } from '@/api/base-api.js'

// 查询编制批次列表
export function queryOrderInfoList(data) {
  return request({
    url: `${basic_api_market}/order/list`,
    method: 'post',
    data: data
  })
}

// 查询单实体
export function queryOrderInfo(data) {
  return request({
    url: `${basic_api_market}/order/get-one`,
    method: 'post',
    data
  })
}

