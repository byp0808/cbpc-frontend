import request from '@/utils/app-request'
import { basic_api_market } from '@/api/base-api.js'

// 基本条款
export function searchBond(data) {
  return request({
    url: `${basic_api_market}/bond-info/allBonds`,
    method: 'post',
    data
  })
}
export function getSamePeople(data) { // 同一发行人列表
  return request({
    url: `${basic_api_market}/bond-info/issuer-info`,
    method: 'post',
    data
  })
}
