import request from '@/utils/app-request'
import { basic_api_curve } from '@/api/base-api.js'

// 查询曲线批次，编制计算列表
export function queryCurveOrderList(data) {
  return request({
    url: `${basic_api_curve}/curveOrder/curveList`,
    method: 'post',
    data
  })
}
// 产品收益率计算列表
export function queryCurveOrderComputeList(data) {
  return request({
    url: `${basic_api_curve}/curveOrderCompute/queryCurveOrderComputeList`,
    method: 'post',
    data
  })
}
// 计算曲线收益完成率
export function calculatCompletionRate(data) {
  return request({
    url: `${basic_api_curve}/curveOrderCompute/calculatCompletionRate`,
    method: 'post',
    data
  })
}

// 曲线发布
export function deployAndCheckCurve(data) {
  return request({
    url: `${basic_api_curve}/curveOrderCompute/deployAndCheckCurve`,
    method: 'post',
    data
  })
}

// 人工计算曲线收益率
export function toCompletotionRate(data) {
  return request({
    url: `${basic_api_curve}/curveOrderCompute/computeByCurveTaskId`,
    method: 'post',
    data
  })
}
