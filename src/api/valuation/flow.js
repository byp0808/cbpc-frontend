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
export function signleData(data) { // 编辑资产组列表数据
  return request({
    url: `${basic_api_valuation}/some-bad/assets-group`,
    method: 'post',
    data
  })
}
export function getValidate(data) { // 编辑资产组列表数据
  return request({
    url: `${basic_api_valuation}/some-bad/assets-group-task`,
    method: 'post',
    data
  })
}
