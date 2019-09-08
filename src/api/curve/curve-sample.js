import request from '@/utils/request-client'
import { basic_path } from '@/api/curve/common.js'

// 查询曲线产品列表,获取下拉
export function getCurveList(data) {
  return request({
    url: `${basic_path}/curveProduct/curveList`,
    method: 'get',
    data
  })
}

// 查询曲线产品列表,包含样本券
export function saveCurveSample(data) {
  return request({
    url: `${basic_path}/curveSample/saveCurveSample`,
    method: 'post',
    data
  })
}

// 查询曲线样本券信息
export function getCurveSample(curveSampleId) {
  return request({
    url: `${basic_path}/curveSample/get/` + curveSampleId,
    method: 'get',
    params: { curveSampleId: curveSampleId }
  })
}

// 删除曲线样本券信息
export function delCurveSample(id) {
  return request({
    url: `${basic_path}/curveSample/delete/` + id,
    method: 'delete'
  })
}

// 查询曲线产品列表,包含样本券
export function submitTask(data) {
  return request({
    url: `${basic_path}/curveSample/submitTask`,
    method: 'post',
    data
  })
}
