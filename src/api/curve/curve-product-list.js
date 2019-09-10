import request from '@/utils/app-request'
import { basic_api_curve } from '@/api/base-api.js'


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
  var options = [];
  getCurveList({}).then(response => {
    var datalist = response
    if (datalist && datalist.length > 0) {
      for (var i = 0; i < datalist.length; i++) {
        var data = datalist[i]
        options.push({ value: data.curvePrdCode, label: data.productName })
      }
    }
  })
  return options;
}
