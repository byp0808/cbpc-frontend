import request from '@/utils/app-request'
import { basic_api_market } from '@/api/base-api.js'

export function querynkTempList(data) {
  return request({
    url: `${basic_api_market}/curve-temp/nk-list`,
    method: 'post',
    data: data
  })
}

export function queryNkTemp(data) {
  return request({
    url: `${basic_api_market}/curve-temp/get-one`,
    method: 'post',
    data
  })
}
export function savenkTemp(data) {
  return request({
    url: `${basic_api_market}/curve-temp/nksave`,
    method: 'post',
    data
  })
}

export function taskSubmit(data) {
  return request({
    url: `${basic_api_market}/curve-temp/nkcheck`,
    method: 'post',
    data
  })
}

export function deletenkTemp(id) {
  return request({
    url: `${basic_api_market}/curve-temp/nkdrop/` + id,
    method: 'get',
    params: { id: id }
  })
}
