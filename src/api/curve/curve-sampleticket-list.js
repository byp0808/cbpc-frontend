import request from '@/utils/app-request'
import { basic_api_curve } from '@/api/base-api.js'

export function queryCurveSampleBondsList(data) {
  return request({
    url: `${basic_api_curve}/curveSampleQuery/curveSampleBondsList`,
    method: 'post',
    data
  })
}
