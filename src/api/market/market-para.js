import request from '@/utils/app-request'
import { basic_api_market } from '@/api/base-api.js'
import { basic_api_portal } from '@/api/base-api.js'

export function queryParaList(data) {
  return request({
    url: `${basic_api_market}/para-info/getAll`,
    method: 'post',
    data: data
  })
}

export function saveParaInfo(data) {
  return request({
    url: `${basic_api_market}/para-info/save`,
    method: 'post',
    data
  })
}

export function getAppRoles(data) {
  return request({
    url: `${basic_api_portal}/sys/user/app-roles`,
    method: 'post',
    data
  })
}
