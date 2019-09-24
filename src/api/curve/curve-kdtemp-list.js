import request from '@/utils/app-request'
import { basic_api_market } from '@/api/base-api.js'

export function querykdTempList(data) {
  return request({
    url: `${basic_api_market}/curve-temp/kd-list`,
    method: 'post',
    data: data
  })
}

export function queryKdTemp(data) {
  return request({
    url: `${basic_api_market}/curve-temp/get-one`,
    method: 'post',
    data
  })
}
export function savekdTemp(data) {
  return request({
    url: `${basic_api_market}/curve-temp/kdsave`,
    method: 'post',
    data
  })
}

export function taskSubmit(data) {
  return request({
    url: `${basic_api_market}/curve-temp/kdcheck`,
    method: 'post',
    data
  })
}

export function deletekdTemp(id) {
  return request({
    url: `${basic_api_market}/curve-temp/kddrop/` + id,
    method: 'get',
    params: { id: id }
  })
}
