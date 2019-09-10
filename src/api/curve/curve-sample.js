import request from '@/utils/app-request'
import { basic_api_curve } from '@/api/base-api.js'

// 查询曲线产品列表,获取下拉
export function getCurveList(data) {
  return request({
    url: `${basic_api_curve}/curveProduct/curveList`,
    method: 'post',
    data
  })
}

// 查询曲线产品列表,包含样本券
export function saveCurveSample(data) {
  return request({
    url: `${basic_api_curve}/curveSample/saveCurveSample`,
    method: 'post',
    data
  })
}

// 查询曲线样本券信息
export function getCurveSample(curveSampleId) {
  return request({
    url: `${basic_api_curve}/curveSample/get/` + curveSampleId,
    method: 'get',
    params: { curveSampleId: curveSampleId }
  })
}

// 删除曲线样本券信息
export function delCurveSample(id) {
  return request({
    url: `${basic_api_curve}/curveSample/delete/` + id,
    method: 'delete'
  })
}

// 查询曲线产品列表,包含样本券
export function submitTask(data) {
  return request({
    url: `${basic_api_curve}/curveSample/submitTask`,
    method: 'post',
    data
  })
}
