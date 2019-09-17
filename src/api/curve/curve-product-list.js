import request from '@/utils/app-request'
import { basic_api_curve } from '@/api/base-api.js'
import { formatTimeToStr } from '@/utils/date.js'

// 查询曲线产品列表,获取下拉
export function getCurveList(data) {
  return request({
    url: `${basic_api_curve}/curveProduct/curveList`,
    method: 'post',
    data
  })
}

// 查询曲线产品列表
export function queryCurveProductList(data) {
  return request({
    url: `${basic_api_curve}/curveProduct/productList`,
    method: 'post',
    data
  })
}
// 保存曲线产品
export function saveProductInfo(data) {
  return request({
    url: `${basic_api_curve}/curveProduct/storageCurveInfo`,
    method: 'post',
    data
  })
}

// 曲线产品确认
export function confirmCurveInfo(productId) {
  return request({
    url: `${basic_api_curve}/curveProduct/confirmCurveInfo/` + productId,
    method: 'post'
  })
}

// 查询曲线产品列表,包含样本券
export function finishCurveInfo(data) {
  return request({
    url: `${basic_api_curve}/curveProduct/finishCurveInfo`,
    method: 'post',
    data
  })
}

// 删除曲线产品
export function delCurveProduct(id) {
  return request({
    url: `${basic_api_curve}/curveProduct/delete/` + id,
    method: 'delete'
  })
}

// 查询曲线产品信息
export function getCurveProduct(id) {
  return request({
    url: `${basic_api_curve}/curveProduct/get/` + id,
    method: 'get',
    params: { id: id }
  })
}
// 获取曲线产品列表，仅包含曲线产品，key为曲线产品编号
export function getCurveProductOptions() {
  var options = []
  getCurveList({}).then(response => {
    var datalist = response
    if (datalist && datalist.length > 0) {
      for (var i = 0; i < datalist.length; i++) {
        var data = datalist[i]
        options.push({ value: data.curvePrdCode, label: data.productName })
      }
    }
  })
  return options
}

// 获取曲线产品列表，仅包含曲线产品，key为曲线产品ID
export function getCurveProductIdOptions() {
  var options = []
  getCurveList({}).then(response => {
    var datalist = response
    if (datalist && datalist.length > 0) {
      for (var i = 0; i < datalist.length; i++) {
        var data = datalist[i]
        options.push({ value: data.curveId, label: data.productName })
      }
    }
  })
  return options
}

// 获取曲线产品、批次列表
export function getCurveOrderList(data) {
  return request({
    url: `${basic_api_curve}/curveProduct/selectCurveAndOrder`,
    method: 'post',
    data
  })
}

// 保存曲线类型
export function storageCurveInfo(data) {
  return request({
    url: `${basic_api_curve}/curveProduct/storageCurveInfo`,
    method: 'post',
    data
  })
}

// 查询曲线产品关键期限
export function queryCurvePrdKd(data) {
  return request({
    url: `${basic_api_curve}/curveProduct/curvePrdKdList`,
    method: 'post',
    data
  })
}

// 查询曲线产品远期期限
export function queryCurvePrdNk(data) {
  return request({
    url: `${basic_api_curve}/curveProduct/curvePrdNkList`,
    method: 'post',
    data
  })
}

// 定义曲线产品关键期限
export function defCurvePeriod(data) {
  return request({
    url: `${basic_api_curve}/curveProduct/defCurvePeriod`,
    method: 'post',
    data
  })
}
