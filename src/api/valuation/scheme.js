import request from '@/utils/app-request'
import { basic_api_curve } from '@/api/base-api.js'

// 调用曲线服务 获取曲线名称
export function getCurveList(data) {
  return request(
    {
      url: `${basic_api_curve}/curveProduct123/curve`,
      method: 'post',
      data: data
    }
  )
}
