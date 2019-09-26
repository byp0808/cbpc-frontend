import request from '@/utils/app-request'
import { basic_api_market } from '@/api/base-api.js'

// 根据id查产品
export function queryProdByID(data) {
  return request({
    url: `${basic_api_market}/prod-view/liked-prods`,
    method: 'post',
    data: data
  })
}

// 查询同部门下的产品列表
export function queryALlProductList(data) {
  return request({
    url: `${basic_api_market}/prod-view/all-prods`,
    method: 'post',
    data: data
  })
}
