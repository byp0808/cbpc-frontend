import request from '@/utils/app-request'
import { basic_api_curve } from '@/api/base-api.js'

// 获取曲线任务批次列表
export async function getCurveTaskOrderList(data) {
  return request({
    url: `${basic_api_curve}/curveTaskOrder/orderList`,
    method: 'post',
    data
  })
}

export async function getCurveTaskOrderOptions(orderList, data) {
  console.info('getCurveTaskOrderOptions...')
  var dataList = []
  if (!data) {
    data = {}
  }
  await getCurveTaskOrderList(data).then(response => {
    dataList = response
  })
  if (dataList && dataList.length > 0) {
    for (var i = 0; i < dataList.length; i++) {
      var item = dataList[i]
      orderList.push({ id: item.orderId, orderName: item.orderName, compTime: item.compTime, pubTime: item.pubTime })
    }
  }
  return orderList
}

// 查询曲线批次，编制计算列表
export function queryCurveOrderList(data) {
  return request({
    url: `${basic_api_curve}/curveOrder/curveList`,
    method: 'post',
    data
  })
}
// 产品收益率计算列表
export function queryCurveOrderComputeList(data) {
  return request({
    url: `${basic_api_curve}/curveOrderCompute/queryCurveOrderComputeList`,
    method: 'post',
    data
  })
}
// 计算曲线收益完成率
export function calculatCompletionRate(data) {
  return request({
    url: `${basic_api_curve}/curveOrderCompute/calculatCompletionRate`,
    method: 'post',
    data
  })
}

// 曲线发布
export function deployAndCheckCurve(data) {
  return request({
    url: `${basic_api_curve}/curveOrderCompute/deployAndCheckCurve`,
    method: 'post',
    data
  })
}

// 人工计算曲线收益率
export function toCompletotionRate(data) {
  return request({
    url: `${basic_api_curve}/curveOrderCompute/computeByCurveTaskId`,
    method: 'post',
    data
  })
}

// 调用接口返回债券集合
export function checkCurveSample(data) {
  return request({
    url: `${basic_api_curve}/curveOrderCompute/checkCurveSample`,
    method: 'post',
    data
  })
}

// 检查曲线样本券
export function checkCurveCouponList(data) {
  return request({
    url: `${basic_api_curve}/curveOrderCompute/checkCurveCoupon`,
    method: 'post',
    data
  })
}

// 获取相同批次下曲线所有的样本券
export function findAll(data) {
  return request({
    url: `${basic_api_curve}/curveOrderCompute/findAll`,
    method: 'post',
    data
  })
}

// 获取相同批次下曲线较上一批增加或者减少的的样本券
export function findAddOrSub(data) {
  return request({
    url: `${basic_api_curve}/curveOrderCompute/findAddOrSub`,
    method: 'post',
    data
  })
}

// 忽略样本券
export function certainIgnore(data) {
  return request({
    url: `${basic_api_curve}/curveOrderCompute/certainIgnore`,
    method: 'post',
    data
  })
}

// 复核或者发布样本券
export function checkOrDeployComp(data) {
  return request({
    url: `${basic_api_curve}/curveOrderCompute/checkOrDeployComp`,
    method: 'post',
    data
  })
}
