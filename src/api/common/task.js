import request from '@/utils/app-request'
import { basic_api_market } from '@/api/base-api.js'

// 查询待办任务列表
export function queryTaskList(data) {
  return request({
    url: `${basic_api_market}/task/todo-list`,
    method: 'post',
    data
  })
}

// 查询任务列表
export function queryTasks(data) {
  return request({
    url: `${basic_api_market}/task/task-list`,
    method: 'post',
    data
  })
}