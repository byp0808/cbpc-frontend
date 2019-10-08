import request from '@/utils/app-request'
import { basic_api_valuation, basic_api_portal } from '@/api/base-api.js'

export function getAllTableList(data) {
  return request(
    {
      url: `${basic_api_valuation}/task/list`,
      method: 'post',
      data: data
    }
  )
}
export function getUserName(id) {
  return request(
    {
      url: `${basic_api_portal}/sys/user/getOrgUsers/${id}`,
      method: 'get'
      // params: { orgId: id }
    }
  )
}
export function saveTask(data) { // 保存任务分配
  return request(
    {
      url: `${basic_api_valuation}/task/allot-task`,
      method: 'post',
      data: data
    }
  )
}
export function addOneTask(data) { // 添加单个任务
  return request(
    {
      url: `${basic_api_valuation}/task/add-task`,
      method: 'post',
      data: data
    }
  )
}
export function addBatchTask(data) { // 添加批量任务
  return request(
    {
      url: `${basic_api_valuation}/task/batch-add`,
      method: 'post',
      data: data
    }
  )
}
export function getTask(data) { // 认领任务
  return request(
    {
      url: `${basic_api_valuation}/task/claim-task`,
      method: 'post',
      data: data
    }
  )
}
export function returnTask(data) { // 退回任务
  return request(
    {
      url: `${basic_api_valuation}/task/back-task`,
      method: 'post',
      data: data
    }
  )
}

