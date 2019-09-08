import request from '@/utils/request-client'
import { basic_api_valuation } from '@/api/base-api.js'

// 查询估值曲线推荐列表
export function queryRecCurveList(data) {
  return request({
    url: `${basic_api_valuation}/valuation-curve/list`,
    method: 'post',
    data
  })
}

// 保存估值曲线配置信息
export function saveRecCurve(data) {
  return request({
    url: `${basic_api_valuation}/valuation-curve/save`,
    method: 'post',
    data
  })
}

// 删除估值曲线配置信息
export function deleteRecCurve(id) {
  return request({
    url: `${basic_api_valuation}/valuation-curve/del`,
    method: 'get',
    params: { id }
  })
}

// 查询估值曲线详细信息
export function queryRecCurve(id) {
  return request({
    url: `${basic_api_valuation}/valuation-curve/get-one`,
    method: 'get',
    params: { id }
  })
}

// 查询估值曲线详细信息
export function queryCurveList() {
  return request({
    url: `${basic_api_valuation}/valuation-curve/curve-list`,
    method: 'get'
  })
}

// 提交任务
export function taskSubmit(data) {
  return request({
    url: `/pi-valuation/valuation-curve/roamTask`,
    method: 'post',
    data
  })
}
