import request from '@/utils/app-request'
import { basic_api_valuation } from '@/api/base-api.js'

export function queryBondsNonpList(data) {
  return request({
    url: `${basic_api_valuation}/bonds-nonp/list`,
    method: 'post',
    data: data
  })
}

export function queryBondsNonp(data) {
  return request({
    url: `${basic_api_valuation}/bonds-nonp/get-one`,
    method: 'post',
    data
  })
}
export function saveBondsNonp(data) {
  return request({
    url: `${basic_api_valuation}/bonds-nonp/save`,
    method: 'post',
    data
  })
}

export function taskSubmit(data) {
  return request({
    url: `/pi-valuation/bonds-nonp/roam-task`,
    method: 'post',
    data
  })
}

export function deleteBondsNonp(data) {
  return request({
    url: `${basic_api_valuation}/bonds-nonp/del`,
    method: 'post',
    data
  })
}

export function switchStatus(data) {
  return request({
    url: `${basic_api_valuation}/bonds-nonp/switch`,
    method: 'post',
    data
  })
}

export function queryBondsById(data) {
  return request({
    url: `${basic_api_valuation}/bonds-nonp/bonds-attr`,
    method: 'post',
    data
  })
}
