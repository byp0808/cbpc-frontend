import request from '@/utils/app-request'
import { basic_api_market } from '@/api/base-api.js'

// 查询默认表头
export function queryDefaultCols(data) {
  return request({
    url: `${basic_api_market}/market-temp/cols-all`,
    method: 'post',
    data: data
  })
}

// 获取满足条件的行情数据
export function queryMarketData(data) {
  return request({
    url: `${basic_api_market}/market-temp/queryMarketData`,
    method: 'post',
    data
  })
}

// 获取模板信息
export function getTempList(data) {
  return request({
    url: `${basic_api_market}/market-temp/list`,
    method: 'post',
    data
  })
}

// 根据模板id获取模板信息
export function getTempById(id) {
  return request({
    url: `${basic_api_market}/market-temp/get-one/` + id,
    method: 'get'
  })
}

// 保存模板信息
export function saveTempInfo(data) {
  return request({
    url: `${basic_api_market}/market-temp/save`,
    method: 'post',
    data
  })
}

