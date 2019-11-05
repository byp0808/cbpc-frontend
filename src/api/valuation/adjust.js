import request from '@/utils/app-request'
import { basic_api_curve, basic_api_valuation } from '@/api/base-api.js'

// 盯市券点差调整-信用债点差调整

// 调用曲线服务 获取曲线列表
export function getCurveList(data) {
  return request(
    {
      url: `${basic_api_curve}/curveProduct/curveList`,
      method: 'post',
      data: data
    }
  )
}

// 计算对敲
export function calculateExchange(data) {
  return request(
    {
      url: `${basic_api_valuation}/point-adjust/calculate-exchange`,
      method: 'post',
      data: data
    }
  )
}
// 查看对敲
export function viewExchange(data) {
  return request(
    {
      url: `${basic_api_valuation}/point-adjust/get-last-exchange`,
      method: 'post',
      data: data
    }
  )
}

// 信用点差计算
export function adjustCredit(data) {
  return request(
    {
      url: `${basic_api_valuation}/point-adjust/calculate-credit-point`,
      method: 'post',
      data
    }
  )
}
// 利率点差计算
export function adjustInterest(data) {
  return request(
    {
      url: `${basic_api_valuation}/point-adjust/adjust-interest`,
      method: 'post',
      data
    }
  )
}
// 保存/修改 本次选中的曲线
export function modifySelectedCurve(data) {
  return request(
    {
      url: `${basic_api_valuation}/point-adjust/modify-selected-curve`,
      method: 'post',
      data
    }
  )
}
