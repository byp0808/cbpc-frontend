import request from '@/utils/app-request'
import { basic_api_valuation } from '@/api/base-api.js'

// 查询估值强制推荐规则列表
export function queryMandatoryList(data) {
  return request({
    url: `${basic_api_valuation}/valuation-force/list`,
    method: 'post',
    data: data
  })
}
// 保存估值强制推荐规则信息
export function saveRecMandatory(data) {
  return request({
    url: `${basic_api_valuation}/valuation-curve/save`,
    method: 'post',
    data
  })
}

// 删除估值强制推荐规则信息
export function deleteRecMandatory(id) {
  return request({
    url: `${basic_api_valuation}/valuation-curve/del`,
    method: 'get',
    params: { id }
  })
}

// 启用估值强制推荐规则信息
export function openRecMandatory(id) {
  return request({
    url: `${basic_api_valuation}/valuation-curve/open`,
    method: 'get',
    params: { id }
  })
}

// 停用估值强制推荐规则信息
export function closeRecMandatory(id) {
  return request({
    url: `${basic_api_valuation}/valuation-curve/close`,
    method: 'get',
    params: { id }
  })
}

// 查询估值强制推荐规则信息
export function queryRecMandatory(id) {
  return request({
    url: `${basic_api_valuation}/valuation-curve/get-one`,
    method: 'get',
    params: { id }
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
