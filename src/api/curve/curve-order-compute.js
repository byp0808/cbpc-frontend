import request from '@/utils/app-request'
import {basic_api_curve} from '@/api/base-api.js'

// 查询曲线批次，编制计算列表
export function queryCurveOrderList(data) {
  return request({
    url: `${basic_api_curve}/curveOrder/curveList`,
    method: 'post',
    data
  })
}
