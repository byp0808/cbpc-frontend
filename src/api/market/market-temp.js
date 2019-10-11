import request from '@/utils/app-request'
import { basic_api_market } from '@/api/base-api.js'

export function saveMarketTemp(data) {
  return request({
    url: `${basic_api_market}/market-temp/save`,
    method: 'post',
    data: data
  })
}

export function queryTempList(data) {
  return request({
    url: `${basic_api_market}/market-temp/list`,
    method: 'post',
    data: data
  })
}

export function deletemarketTemp(id) {
  return request({
    url: `${basic_api_market}/market-temp/drop/` + id,
    method: 'get',
    params: { id: id }
  })
}

export function getMarketTemp(id) {
  return request({
    url: `${basic_api_market}/market-temp/get-one/` + id,
    method: 'get',
    params: { id: id }
  })
}
