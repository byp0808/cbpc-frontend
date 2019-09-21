import request from '@/utils/app-request'
import { basic_api_market } from '@/api/base-api.js'

// 查询编制批次列表
export function queryOrderInfoList(data) {
  return request({
    url: `${basic_api_market}/order/list`,
    method: 'post',
    data: data
  })
}

// 查询单实体
export function queryOrderInfo(data) {
  return request({
    url: `${basic_api_market}/order/get-one`,
    method: 'post',
    data
  })
}

// 保存批次，并发起审核任务
export function saveOrderInfo(data) {
  return request({
    url: `${basic_api_market}/order/save`,
    method: 'post',
    data
  })
}

// 审核编制批次任务
export function taskOrderInfoSubmit(data) {
  return request({
    url: `${basic_api_market}/order/roam-task`,
    method: 'post',
    data
  })
}

// 删除编制批次
export function deleteOrderInfo(data) {
  return request({
    url: `${basic_api_market}/order/del`,
    method: 'post',
    data
  })
}

// 启用和停用批次
export function switchStatus(data) {
  return request({
    url: `${basic_api_market}/order/switch`,
    method: 'post',
    data
  })
}

