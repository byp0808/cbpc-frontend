import request from '@/utils/request-client'
import { basic_api_valuation } from '@/api/base-api.js'

// 获取一条 任务分配范围 详细信息
export function queryTaskRange(data) {
  return request(
    {
      url: `${basic_api_valuation}/valuation-task/task-range`,
      method: 'post',
      data: data
    }
  )
}

// 获取任务分配范围列表
export function queryTaskRangeList(data) {
  return request(
    {
      url: `${basic_api_valuation}/valuation-task/task-range-list`,
      method: 'post',
      data: data
    }
  )
}
// 新增任务分配范围
export function addTaskRange(data) {
  return request(
    {
      url: `${basic_api_valuation}/valuation-task/save-task-range`,
      method: 'post',
      data: data
    }
  )
}
// 停用/启用 任务分配范围
export function editBusiStatus(data) {
  return request(
    {
      url: `${basic_api_valuation}/valuation-task/edit-busi-status`,
      method: 'post',
      data: data
    }
  )
}
// 删除 任务分配范围
export function delTaskRange(id) {
  return request(
    {
      url: `${basic_api_valuation}/valuation-task/del-task-range`,
      method: 'post',
      data: { id: id, busiStatus: '05' }
    }
  )
}

// 获取人员任务分配列表
export function taskAllocationList(data) {
  return request(
    {
      url: `${basic_api_valuation}/valuation-task/task-allocation-list`,
      method: 'post',
      data: data
    }
  )
}
// 停用/启用 人员任务分配规则
export function editTaskAllocation(data) {
  return request(
    {
      url: `${basic_api_valuation}/valuation-task/edit-task-busi-status`,
      method: 'post',
      data: data
    }
  )
}
// 删除 人员任务分配规则
export function delTaskAllocation(data) {
  return request(
    {
      url: `${basic_api_valuation}/valuation-task/del-task-allocation`,
      method: 'post',
      data: data
    }
  )
}

// 新增/编辑 人员任务分配规则
export function addTaskAllocation(data) {
  return request(
    {
      url: `${basic_api_valuation}/valuation-task/add-task-allocation`,
      method: 'post',
      data: data
    }
  )
}
