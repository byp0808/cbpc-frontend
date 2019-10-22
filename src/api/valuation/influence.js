import request from '@/utils/app-request'
import { basic_api_market } from '@/api/base-api.js'

// 基本条款
export function searchBond(data) {
  return request({
    url: `${basic_api_market}/bond-info/list`,
    method: 'post',
    data
  })
}
