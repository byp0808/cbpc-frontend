import request from '@/utils/app-request'
import { basic_api_curve } from '@/api/base-api.js'

export function queryCurveCrossLineList(data) {
  return request({
    url: `${basic_api_curve}/curveProduct/curveSampleBondsList`,
    method: 'post',
    data
  })
}
export function queryCurveCrossLineTitle() {
  return request({
    url: `${basic_api_curve}/curveProduct/curveSampleBondsList`,
    method: 'post'
  })
}
