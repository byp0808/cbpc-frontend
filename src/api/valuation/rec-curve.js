import request from '@/utils/app-request'
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
export function deleteRecCurve(data) {
  return request({
    url: `${basic_api_valuation}/valuation-curve/del`,
    method: 'post',
    data
  })
}

// 启用/停用估值曲线配置信息
export function switchStatus(data) {
  return request({
    url: `${basic_api_valuation}/valuation-curve/switch`,
    method: 'post',
    data
  })
}

// 查询估值曲线详细信息
export function queryRecCurve(data) {
  return request({
    url: `${basic_api_valuation}/valuation-curve/get-one`,
    method: 'post',
    data
  })
}

// 查询估值曲线详细信息
export function queryCurveList() {
  return request({
    url: `${basic_api_valuation}/valuation-curve/curve-list`,
    method: 'post'
  })
}

// 提交任务
export function taskSubmit(data) {
  return request({
    url: `/pi-valuation/valuation-curve/roam-task`,
    method: 'post',
    data
  })
}
