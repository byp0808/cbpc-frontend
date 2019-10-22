import request from '@/utils/app-request'
import { basic_api_curve, basic_api_market } from '@/api/base-api.js'

// 获取批次列表
export function getOrderName(id) {
  var list = getOrderList()
  var label = id
  for (const index in list) {
    const item = list[index]
    if (id === item.id) {
      return item.orderName
    }
  }
  return label
}

// 获取批次列表
export async function getOrderList(data) {
  return request({
    url: `${basic_api_market}/order/all-list`,
    method: 'post',
    data
  })
}

export async function getOrderListOptions(orderList) {
  if (!orderList) {
    orderList = []
  }
  var dataList = []
  await getOrderList({ 'basePrd': '02' }).then(response => {
    dataList = response
  })
  if (dataList && dataList.length > 0) {
    for (var i = 0; i < dataList.length; i++) {
      var item = dataList[i]
      orderList.push({ id: item.orderNo, orderName: item.orderName, compTime: item.compTime, pubTime: item.pubTime })
    }
  }
  return orderList
}

// 获取已关联批次
export function getProductOrderList(data) {
  return request({
    url: `${basic_api_curve}/curveProductOrder/orders`,
    method: 'post',
    data
  })
}
// 获取关键期限
export function queryCurvePrdOrderKtList(data) {
  return request({
    url: `${basic_api_curve}/curveProductOrder/orderKts`,
    method: 'post',
    data
  })
}

// 查询产品-自动编制
export function queryProductOrderAutoList(data) {
  return request({
    url: `${basic_api_curve}/curveProductOrderAuto/list`,
    method: 'post',
    data
  })
}

// 保存产品批次信息
export function savePrdOrder(data) {
  return request({
    url: `${basic_api_curve}/curveProductOrder/save`,
    method: 'post',
    data
  })
}

// 查询产品-自动编制-关联曲线对应的产品关键期限
export function queryAutoPrdOrderKts(data) {
  return request({
    url: `${basic_api_curve}/curveProductOrderAuto/autoPrdOrderKts`,
    method: 'post',
    data
  })
}

// 查询产品-曲线编号，查询关键期限列表
// 只返回关键期限列表
export function queryPrdOrderKts(data) {
  return request({
    url: `${basic_api_curve}/curveProductOrderAuto/prdOrderKts`,
    method: 'post',
    data
  })
}

// 返回关键期限列表信息
export function queryPrdOrderKtInfoList(data) {
  return request({
    url: `${basic_api_curve}/curveProductOrderAuto/prdOrderKtInfoList`,
    method: 'post',
    data
  })
}
// 根据曲线编号，查询曲线自动编制关键期限
export function queryPrdOrderAutoKts(data) {
  return request({
    url: `${basic_api_curve}/curveProductOrderAuto/prdOrderAutoKds`,
    method: 'post',
    data
  })
}

// 查看曲线性质
export function viewCurveProperty(data) {
  return request({
    url: `${basic_api_curve}/curveOrderCompute/viewCurveProperty`,
    method: 'post',
    data
  })
}
