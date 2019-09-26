import request from '@/utils/app-request'
import { basic_api_curve, basic_api_valuation } from '@/api/base-api.js'

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

// 调整隐含评级联动曲线
export function findCurveByMarketGrade(data) {
  return request(
    {
      url: `${basic_api_valuation}/scheme/find-curve`,
      method: 'post',
      data: data
    }
  )
}
