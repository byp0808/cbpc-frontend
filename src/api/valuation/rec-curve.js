import request from '@/utils/request-client'
import { basic_path } from '@/api/valuation/common.js'

// 查询估值曲线推荐列表
export function queryRecCurveList(data) {
  return request({
    url: `${basic_path}/valuation-curve/list`,
    method: 'post',
    data
  })
}

// 保存估值曲线配置信息
export function saveRecCurve(data) {
  return request({
    url: `${basic_path}/valuation-curve/save`,
    method: 'post',
    data
  })
}

// 查询估值曲线详细信息
export function queryRecCurve(id) {
  return request({
    url: `${basic_path}/valuation-curve/get-one`,
    method: 'get',
    params: { id }
  })
}

// 查询估值曲线详细信息
export function queryCurveList() {
  return request({
    url: `${basic_path}/valuation-curve/curve-list`,
    method: 'get'
  })
}
