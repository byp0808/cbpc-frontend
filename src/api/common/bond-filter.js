import request from '@/utils/request-client'
import { basic_path } from '@/api/common/common.js'

// 查询模板列表
export function queryTempList(data) {
  return request({
    url: `${basic_path}/bond-filter/tpl-list`,
    method: 'get',
    params: {}
  })
}

// 查询模板列表
export function queryTempInfo(tempNo) {
  return request({
    url: `${basic_path}/bond-filter/tpl-view`,
    method: 'get',
    params: { tempNo }
  })
}

// 查询所有的债券
export function queryBondsAll(bondName) {
  return request({
    url: `${basic_path}/bond-filter/bond-query`,
    method: 'get',
    params: { bondName }
  })
}

// 查询债券筛选结果
export function queryBondsResult(data) {
  return request({
    url: `${basic_path}/bond-filter/filter-result`,
    method: 'post',
    data
  })
}

// 根据筛选器Id 查筛选器详细信息
export function queryFilterInfoById(filterId) {
  return request({
    url: `${basic_path}/bond-filter/stored-filter`,
    method: 'get',
    params: { filterId }
  })
}
