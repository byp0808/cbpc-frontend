import request from '@/utils/app-request'
import { basic_api_curve, basic_api_portal } from '@/api/base-api'

// 筛选曲线产品
export function selectCurve(data) {
  return request({
    url: `${basic_api_curve}` + '/curveProduct/filter',
    method: 'post',
    data: data
  })
}

// 查询曲线任务
export function selectCurveTask(data) {
  return request({
    url: `${basic_api_curve}` + '/curve/curveTask',
    method: 'post',
    data: data
  })
}

// 查询我的曲线任务
export function selectMyCurveTask(data) {
  return request({
    url: `${basic_api_curve}` + '/curve/curveTaskByUser',
    method: 'post',
    data: data
  })
}

// 筛选员工
export function selectPerson(data) {
  return request({
    url: `${basic_api_portal}` + '/sys/user/getUsers',
    method: 'post',
    data: data
  })
}

// 更新曲线任务
export function updateCurveTask(data) {
  return request({
    url: `${basic_api_curve}` + '/curve/updateCurveTasks',
    method: 'post',
    data: data
  })
}

// 认领曲线任务
export function chaimCurveTask(id) {
  console.log('1111111111' + id)
  return request({
    url: `${basic_api_curve}/curve/claimCurveTask/` + id,
    method: 'get',
    params: { id: id }
  })
}

// 退回曲线任务
export function refundCurveTask(data) {
  return request({
    url: `${basic_api_curve}` + '/curve/refundCurveTasks',
    method: 'post',
    data: data
  })
}

// 查询曲线任务规则
export function queryCurveTaskRules(data) {
  return request({
    url: `${basic_api_curve}` + '/curve/queryTaskRules',
    method: 'post',
    data: data
  })
}

// 查询曲线批次
export function selectCurveOrder(data) {
  return request({
    url: `${basic_api_curve}` + '/curveProductOrder/orders',
    method: 'post',
    data: data
  })
}

// 修改规则责任人
export function updateTaskRules(data) {
  return request({
    url: `${basic_api_curve}` + '/curve/saveTaskRules',
    method: 'post',
    data: data
  })
}

// 查询曲线批次
export function queryOrder(data) {
  return request({
    url: `${basic_api_curve}` + '/curve/queryOrder',
    method: 'post',
    data: data
  })
}

// 查询曲线方案
export function querycurveSolution(data) {
  return request({
    url: `${basic_api_curve}` + '/curve/queryCurveBuildWayInfo',
    method: 'post',
    data: data
  })
}
