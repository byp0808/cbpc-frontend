import request from '@/utils/app-request'
import { basic_api_market } from '@/api/base-api.js'

// 查询模板列表
export function queryTempList(data) {
  return request({
    url: `${basic_api_market}/tmpl-filter/tpl-list`,
    method: 'post',
    data: data
  })
}

// 查询模板列表
export function queryTempInfo(data) {
  return request({
    url: `${basic_api_market}/tmpl-filter/tpl-view`,
    method: 'post',
    data: data
  })
}

// 查询所有的债券
export function queryBondsAll(bondName) {
  return request({
    url: `${basic_api_market}/tmpl-filter/bond-query`,
    method: 'get',
    params: { bondName }
  })
}

// 查询债券筛选结果
export function queryBondsResult(data) {
  return request({
    url: `${basic_api_market}/tmpl-filter/filter-result`,
    method: 'post',
    data
  })
}

// 根据筛选器Id 查筛选器详细信息
export function queryFilterInfoById(filterId) {
  return request({
    url: `${basic_api_market}/tmpl-filter/stored-filter`,
    method: 'get',
    params: { filterId }
  })
}

// 保存模板
export function addTempList(data) {
  return request({
    url: `${basic_api_market}/tmpl-filter/save-filter`,
    method: 'post',
    data
  })
}

// 查询所有模板信息
export function queryAllTempLists(data) {
  return request({
    url: `${basic_api_market}/tmpl-filter/all-list`,
    method: 'post',
    data
  })
}

// 查询所有模板信息
export function deleteByTempId(data) {
  return request({
    url: `${basic_api_market}/tmpl-filter/delete-filter`,
    method: 'post',
    data
  })
}
