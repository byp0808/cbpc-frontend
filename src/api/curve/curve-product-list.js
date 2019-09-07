import request from '@/utils/request-client'
import { basic_path } from '@/api/curve/common.js'

// 查询曲线产品列表
export function queryCurveProductList(data) {
  return request({
    url: `${basic_path}/curveProduct/productList`,
    method: 'post',
    data
  })
}
