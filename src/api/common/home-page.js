import request from '@/utils/app-request'
import { basic_path } from '@/api/common/common.js'

// 查询待办任务列表
export function queryTaskList(data) {
  return request({
    url: `${basic_path}/task/todo-list`,
    method: 'post',
    data
  })
}
