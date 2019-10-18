import request from '@/utils/app-request'
import { basic_api_curve } from '@/api/base-api.js'

export function selectFormulaType() {
  return [
    { value: '>', label: '>' },
    { value: '<', label: '<' },
    { value: '>=', label: '>=' },
    { value: '<=', label: '<=' },
    { value: '==', label: '==' },
    { value: '!=', label: '!=' },
    { value: '<>', label: '<>' }
  ]
}

// 获取信用债初始化方案列表
export function getInitPageList(data) {
  return request({
    url: `${basic_api_curve}/curveSetInit/initPageList`,
    method: 'post',
    data
  })
}

// 获取信用债初始化方案公式列表
export function getInitFormulaList(data) {
  return request({
    url: `${basic_api_curve}/curveSetInit/initFormulaList`,
    method: 'post',
    data
  })
}

// 获取信用债初始化方案明细列表
export function getInitDetailList(data) {
  return request({
    url: `${basic_api_curve}/curveSetInit/initDetailList`,
    method: 'post',
    data
  })
}

// 根据ID获取初始化方案记录
export function getInitId(id) {
  return request({
    url: `${basic_api_curve}/curveSetInit/getInit/${id}`,
    method: 'get'
  })
}

// 保存初始化方案信息
export function saveInitInfo(data) {
  return request({
    url: `${basic_api_curve}/curveSetInit/save`,
    method: 'post',
    data
  })
}

// 审批流程完成
export function getTaskFinsih(data) {
  return request({
    url: `${basic_api_curve}/curveSetInit/taskFinsih`,
    method: 'post',
    data
  })
}

// 删除方案信息
export function delInitList(id) {
  return request({
    url: `${basic_api_curve}/curveSetInit/delete` + id,
    method: 'delete'
  })
}

// 获取初始化列表，仅包含曲线产品，key为曲线产品编号
export function getDetalInitOptions() {
  var options = []
  getInitDetailList({}).then(response => {
    var datalist = response
    if (datalist && datalist.length > 0) {
      for (var i = 0; i < datalist.length; i++) {
        var data = datalist[i]
        options.push({ data })
      }
    }
  })
  return options
}

// 审批完成
export function submitTask(data) {
  return request({
    url: `${basic_api_curve}/curveSetInit/submitTask`,
    method: 'post',
    data
  })
}