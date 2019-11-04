import request from '@/utils/app-request'
import { basic_api_curve, basic_api_valuation } from '@/api/base-api.js'

// 调用曲线服务 获取曲线名称
export function getCurveList(data) {
  return request(
    {
      url: `${basic_api_curve}/curveProduct123/curve`,
      method: 'post',
      data: data
    }
  )
}

// 调整隐含评级联动曲线
export function findCurveByMarketGrade(data) {
  return request(
    {
      url: `${basic_api_valuation}/scheme/find-curve`,
      method: 'post',
      data: data
    }
  )
}

// 点差试算
export function spreadTrial(data) {
  return request(
    {
      url: `${basic_api_valuation}/scheme/spread-trial`,
      method: 'post',
      data: data
    }
  )
}

// 方案保存
export function save(data) {
  return request(
    {
      url: `${basic_api_valuation}/scheme/save`,
      method: 'post',
      data: data
    }
  )
}

// 历史估值方案
export function history(data) {
  return request(
    {
      url: `${basic_api_valuation}/scheme/history`,
      method: 'post',
      data: data
    }
  )
}

// 估值任务方案
export function taskScheme(data) {
  return request(
    {
      url: `${basic_api_valuation}/scheme/task-scheme`,
      method: 'post',
      data
    }
  )
}

// 点差转换
export function convertSpread(data) {
  return request(
    {
      url: `${basic_api_valuation}/scheme/convert-spread`,
      method: 'post',
      data
    }
  )
}
