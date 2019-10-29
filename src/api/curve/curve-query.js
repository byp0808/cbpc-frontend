import request from '@/utils/app-request'
import { basic_api_curve, basic_api_market } from '@/api/base-api'

// 查询曲线行情
export function queryCurveSolutions(data) {
  return request({
    url: `${basic_api_curve}` + '/scheme/queryCurveBuildWayInfo',
    method: 'post',
    data: data
  })
}

// Shidor
export function queryShidor(data) {
  return request({
    url: `${basic_api_market}` + '/analyse-if/shibor',
    method: 'post',
    data: data
  })
}

// lidor
export function querylidor(data) {
  return request({
    url: `${basic_api_market}` + '/analyse-if/libor',
    method: 'post',
    data: data
  })
}

// 美国国债
export function queryUstreasuries(data) {
  return request({
    url: `${basic_api_market}` + '/analyse-if/ustreasuries',
    method: 'post',
    data: data
  })
}
