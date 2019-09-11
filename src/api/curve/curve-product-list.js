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
// 获取曲线产品列表，仅包含曲线产品
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

// 获取曲线产品、批次列表
export function getCurveOrderList(data) {
  return request({
    url: `${basic_api_curve}/curveProduct/selectCurveAndOrder`,
    method: 'post',
    data
  })
}

// 获取关键期限
export function getProdcutKdList() {
  var list = [
    { id: 'Kd_ID_1', standSlip: '0d', lastUpdTs: 1568103569818 },
    { id: 'Kd_ID_2', standSlip: '1m', lastUpdTs: 1568104569818 },
    { id: 'Kd_ID_3', standSlip: '3m', lastUpdTs: 1568107569818 },
    { id: 'Kd_ID_4', standSlip: '6m', lastUpdTs: 1568108569818 }
  ]
  return list
}
