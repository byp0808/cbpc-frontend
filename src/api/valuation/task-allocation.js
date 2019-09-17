import request from '@/utils/request-client'
import { basic_api_valuation } from '@/api/base-api.js'

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
