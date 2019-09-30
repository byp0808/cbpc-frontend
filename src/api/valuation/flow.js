import request from '@/utils/app-request'
import { basic_api_valuation } from '@/api/base-api.js'

export function getAssetData(data) { // 获取资产组列表数据
  return request({
    url: `${basic_api_valuation}/some-bad/assets-group-list`,
    method: 'post',
    data
  })
}
export function deleteAssetData(data) { // 删除资产组列表数据
  return request({
    url: `${basic_api_valuation}/some-bad/del-assets-group`,
    method: 'post',
    data
  })
}
export function saveData(data) { // 保存资产组列表数据
  return request({
    url: `${basic_api_valuation}/some-bad/save-assets-group`,
    method: 'post',
    data
  })
}
export function signleData(data) { // 获取单个资产组
  return request({
    url: `${basic_api_valuation}/some-bad/assets-group`,
    method: 'post',
    data
  })
}
export function getValidate(data) { // 资产组审核 通过/不通过
  return request({
    url: `${basic_api_valuation}/some-bad/assets-group-task`,
    method: 'post',
    data
  })
}

export function spreadParamList(data) { // 获取点差参数列表
  return request({
    url: `${basic_api_valuation}/some-bad/spread-param-list`,
    method: 'post',
    data
  })
}
export function spreadParam(data) { // 获取点差参数
  return request({
    url: `${basic_api_valuation}/some-bad/spread-param`,
    method: 'post',
    data
  })
}
export function saveSpreadParam(data) { // 保存/编辑 点差参数
  return request({
    url: `${basic_api_valuation}/some-bad/save-spread-param`,
    method: 'post',
    data
  })
}
export function deleteSpreadParam(data) { // 删除点差参数
  return request({
    url: `${basic_api_valuation}/some-bad/del-spread-param`,
    method: 'post',
    data
  })
}
export function spreadParamTaskSubmit(data) { // 点差参数 审核通过/不通过
  return request({
    url: `${basic_api_valuation}/some-bad/spread-param-task`,
    method: 'post',
    data
  })
}
export function someBadList(data) { // 获取点差规则列表
  return request({
    url: `${basic_api_valuation}/some-bad/some-bad-list`,
    method: 'post',
    data
  })
}
export function someBad(data) { // 获取点差规则
  return request({
    url: `${basic_api_valuation}/some-bad/some-bad`,
    method: 'post',
    data
  })
}
export function saveSomeBad(data) { // 保存/编辑 点差规则
  return request({
    url: `${basic_api_valuation}/some-bad/save-some-bad`,
    method: 'post',
    data
  })
}
export function assetsGroups() { // 获取启用状态的资产组列表
  return request({
    url: `${basic_api_valuation}/some-bad/assets-groups`,
    method: 'post'
  })
}
export function spreadParams() { // 获取启用状态的点差参数列表
  return request({
    url: `${basic_api_valuation}/some-bad/spread-params`,
    method: 'post'
  })
}
export function delSomeBad(data) { // 删除点差规则
  return request({
    url: `${basic_api_valuation}/some-bad/del-some-bad`,
    method: 'post',
    data
  })
}
export function someBadTask(data) { // 点差规则 通过/不通过
  return request({
    url: `${basic_api_valuation}/some-bad/some-bad-task`,
    method: 'post',
    data
  })
}

