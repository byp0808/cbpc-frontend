import request from '@/utils/request-client'
import { basic_api_valuation, basic_api_curve } from '@/api/base-api.js'

// 获取曲线关系列表
export function queryCurveRelationList(data) {
  return request(
    {
      url: `${basic_api_valuation}/curve-relation/curve-relation-list`,
      method: 'post',
      data: data
    }
  )
}
// 获取曲线关系
export function queryCurveRelation(data) {
  return request(
    {
      url: `${basic_api_valuation}/curve-relation/get-curve-relation`,
      method: 'post',
      data: data
    }
  )
}
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
// 调用曲线服务 获取曲线名称
// export function getCurve(data) {
//   return request(
//     {
//       url: `${basic_api_curve}/curveProduct/curve`,
//       method: 'post',
//       data: data
//     }
//   )
// }
// 保存 曲线关系规则
export function saveCurveRelation(data) {
  return request(
    {
      url: `${basic_api_valuation}/curve-relation/save-curve-relation`,
      method: 'post',
      data: data
    }
  )
}
// 停/启 曲线关系规则
export function editCurveRelationBusiStatus(data) {
  return request(
    {
      url: `${basic_api_valuation}/curve-relation/edit-busi-status`,
      method: 'post',
      data: data
    }
  )
}
// 删除 曲线关系规则
export function delCurveRelation(data) {
  return request(
    {
      url: `${basic_api_valuation}/curve-relation/edit-busi-status`,
      method: 'post',
      data: data
    }
  )
}

// 复核申请
export function taskSubmit(data) {
  return request(
    {
      url: `${basic_api_valuation}/curve-relation/roamTask`,
      method: 'post',
      data: data
    }
  )
}
