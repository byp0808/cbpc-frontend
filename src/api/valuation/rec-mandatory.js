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
    url: `${basic_api_valuation}/valuation-force/save`,
    method: 'post',
    data
  })
}

// 删除估值强制推荐规则信息
export function deleteRecMandatory(data) {
  return request({
    url: `${basic_api_valuation}/valuation-force/del`,
    method: 'post',
    data
  })
}

// 启用/停用估值强制推荐规则信息
export function switchStatus(data) {
  return request({
    url: `${basic_api_valuation}/valuation-force/switch`,
    method: 'post',
    data
  })
}

// 查询估值强制推荐规则信息
export function queryRecMandatory(data) {
  return request({
    url: `${basic_api_valuation}/valuation-force/get-one`,
    method: 'post',
    data
  })
}

// 提交任务
export function taskSubmit(data) {
  return request({
    url: `${basic_api_valuation}/valuation-force/roam-task`,
    method: 'post',
    data
  })
}
