import request from '@/utils/app-request'
import { basic_api_curve } from '@/api/base-api'

// 查询曲线行情
export function queryCurveSolutions(data) {
  return request({
    url: `${basic_api_curve}` + '/scheme/queryCurveBuildWayInfo',
    method: 'post',
    data: data
  })
}
