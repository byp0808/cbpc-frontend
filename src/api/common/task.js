import request from '@/utils/request-client'
import { basic_path } from '@/api/common/common.js'

// 查询待办任务列表
export function queryTaskList(data) {
  return request({
    url: `${basic_path}/task/todo-list`,
    method: 'post',
    data
  })
}

// 提交任务
export function taskSubmit(data) {
  return request({
    url: `/pi-valuation/valuation-curve/roamTask`,
    method: 'post',
    data
  })
}
