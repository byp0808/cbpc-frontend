import request from '@/utils/request-client'
import { basic_api_market } from '@/api/base-api.js'

// 查询曲线产品列表
export function queryCurveProductList(data) {
  return request({
    url: `${basic_api_market}/curveProduct/productList`,
    method: 'post',
    data
  })
}
