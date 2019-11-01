import request from '@/utils/app-request'
import { basic_api_valuation } from '@/api/base-api.js'

// 批量计算列表
export function cmptBatchList(data) {
  return request({
    url: `${basic_api_valuation}/cmpt/batch-list`,
    method: 'post',
    data
  })
}

// 批量计算
export function cmptBatch(data) {
  return request({
    url: `${basic_api_valuation}/cmpt/batch-cmpt`,
    method: 'post',
    data
  })
}

// 单资产查询
export function assetAdd(data) {
  return request({
    url: `${basic_api_valuation}/cmpt/asset-add`,
    method: 'post',
    data
  })
}

// 单资产添加
export function taskAdd(data) {
  return request({
    url: `${basic_api_valuation}/cmpt/task-add`,
    method: 'post',
    data
  })
}

// 单资产计算
export function taskCmpt(data) {
  return request({
    url: `${basic_api_valuation}/cmpt/task-cmpt`,
    method: 'post',
    data
  })
}
