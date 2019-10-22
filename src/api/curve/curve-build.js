import request from '@/utils/app-request'
import { basic_api_curve } from '@/api/base-api'

// 查询曲线关键期限和样本空间
export function queryCurveKeyTerm(data) {
  return request({
    url: `${basic_api_curve}` + '/scheme/queryCurveKeyTerm',
    method: 'post',
    data: data
  })
}

// 查询曲线关键期限和今日、昨日收益率
export function queryCurveYield(data) {
  return request({
    url: `${basic_api_curve}` + '/scheme/queryCurveYield',
    method: 'post',
    data: data
  })
}

// 查询曲线初始化编制方案
export function queryInitCurveYield(data) {
  return request({
    url: `${basic_api_curve}` + '/scheme/queryInitCurveYield',
    method: 'post',
    data: data
  })
}

// 查询参考曲线
export function queryReferCurveYield(data) {
  return request({
    url: `${basic_api_curve}` + '/scheme/queryReferCurveYield',
    method: 'post',
    data: data
  })
}

// 查询关系曲线
export function queryRelationsCurveYield(data) {
  return request({
    url: `${basic_api_curve}` + '/scheme/queryRelationsCurveYield',
    method: 'post',
    data: data
  })
}

// 查询曲线同调曲线
export function queryHomology(data) {
  return request({
    url: `${basic_api_curve}` + '/scheme/queryHomoCurveKeyTerm',
    method: 'post',
    data: data
  })
}

// 保存曲线编制方案
export function saveCurveBuild(data) {
  return request({
    url: `${basic_api_curve}` + '/scheme/saveCurveBuild',
    method: 'post',
    data: data
  })
}

// 计算曲线历史分位点
export function queryHistoryDivision(data) {
  return request({
    url: `${basic_api_curve}` + '/curveSet/computeHisIndex',
    method: 'post',
    data: data
  })
}

// 确认曲线编制方案
export function confirmBuild(data) {
  return request({
    url: `${basic_api_curve}` + '/scheme/confirmCurveBuild',
    method: 'post',
    data: data
  })
}

// 退回曲线编制方案
export function refundBuild(data) {
  return request({
    url: `${basic_api_curve}` + '/scheme/refundCurveBuild',
    method: 'post',
    data: data
  })
}

// 重置曲线编制方案
export function resetBuild(data) {
  return request({
    url: `${basic_api_curve}` + '/scheme/resetCurveBuild',
    method: 'post',
    data: data
  })
}
