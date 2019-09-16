import request from '@/utils/app-request'
import { basic_api_valuation } from '@/api/base-api.js'

export function queryDateSetList(data) {
  return request({
    url: `${basic_api_valuation}/date-set/list`,
    method: 'post',
    data: data
  })
}

export function queryDateSet(data) {
  return request({
    url: `${basic_api_valuation}/date-set/get-one`,
    method: 'post',
    data
  })
}
export function saveDateSet(data) {
  return request({
    url: `${basic_api_valuation}/date-set/save`,
    method: 'post',
    data
  })
}

export function taskSubmit(data) {
  return request({
    url: `/pi-valuation/date-set/roam-task`,
    method: 'post',
    data
  })
}

export function deleteDateSet(data) {
  return request({
    url: `${basic_api_valuation}/date-set/del`,
    method: 'post',
    data
  })
}

export function switchStatus(data) {
  return request({
    url: `${basic_api_valuation}/date-set/switch`,
    method: 'post',
    data
  })
}
