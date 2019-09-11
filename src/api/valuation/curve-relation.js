import request from '@/utils/request-client'
import { basic_api_valuation } from '@/api/base-api.js'
import { basic_api_curve } from '@/api/base-api.js'

// 获取曲线关系列表
export function queryCurveRelationList() {
  return request(
    {
      url: `${basic_api_valuation}/curve-relation/curve-relation-list`,
      method: 'get',
      params: {}
    }
  )
}
// 获取曲线关系
export function queryCurveRelation() {
  return request(
    {
      url: `${basic_api_valuation}/curve-relation/curve-relation`,
      method: 'get',
      params: {}
    }
  )
}
// 调用曲线服务获取曲线列表
// 获取曲线关系列表
export function getCurveList() {
  return request(
    {
      url: `${basic_api_curve}/curveProduct/curve`,
      method: 'get',
      params: {}
    }
  )
}
// 保存 曲线关系规则
export function saveCurveRelation(data) {
  return request(
    {
      url: `${basic_api_valuation}/curve-relation/save-curve-relation`,
      method: 'get',
      params: data
    }
  )
}
// 编辑 曲线关系规则
export function editCurveRelation(data) {
  return request(
    {
      url: `${basic_api_valuation}/curve-relation/edit-curve-relation`,
      method: 'get',
      params: data
    }
  )
}
// 停/启/删除 曲线关系规则
export function editCurveRelationBusiStatus(data) {
  return request(
    {
      url: `${basic_api_valuation}/curve-relation/edit-busi-status`,
      method: 'get',
      params: data
    }
  )
}

// 复核申请
export function taskSubmit(data) {
  return request(
    {
      url: `${basic_api_valuation}/curve-relation/roamTask`,
      method: 'get',
      params: data
    }
  )
}
