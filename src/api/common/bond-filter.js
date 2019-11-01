import request from '@/utils/app-request'
import { basic_api_market } from '@/api/base-api.js'
import { basic_api_portal } from '@/api/base-api.js'

// 查询模板列表
export function queryTempList(data) {
  return request({
    url: `${basic_api_market}/bond-filter/tpl-list`,
    method: 'get',
    params: {}
  })
}

// 查询模板列表
export function queryTempInfo(tempId) {
  return request({
    url: `${basic_api_market}/bond-filter/tpl-view`,
    method: 'get',
    params: { tempId }
  })
}

// 查询所有的债券
export function queryBondsAll(data) {
  return request({
    url: `${basic_api_market}/bond-info/allBonds`,
    method: 'post',
    data
  })
}

// 查询所有筛选指标
export function queryFilterIndex(data) {
  return request({
    url: `${basic_api_portal}/sys/sys-para/getByType`,
    method: 'post',
    data
  })
}

// 查询债券筛选结果
export function queryBondsResult(data) {
  return request({
    url: `${basic_api_market}/bond-filter/filter-result`,
    method: 'post',
    data
  })
}

// 根据筛选器Id 查筛选器详细信息
export function queryFilterInfoById(data) {
  return request({
    url: `${basic_api_market}/bond-filter/stored-filter`,
    method: 'post',
    data
  })
}

// 根据筛选器Id 查筛选器详细信息
export function checkRepeat(data) {
  return request({
    url: `${basic_api_market}/bond-filter/check-repeat`,
    method: 'post',
    data
  })
}
