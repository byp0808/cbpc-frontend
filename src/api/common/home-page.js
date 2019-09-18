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

// 查询日历列表
export function queryCalendarList(data) {
  return request({
    url: `${basic_api_market}/mycalendar/day-list`,
    method: 'post',
    data
  })
}

// 查询日历列表
export function saveMyCalendar(data) {
  return request({
    url: `${basic_api_market}/mycalendar/save`,
    method: 'post',
    data
  })
}

// 消息查询
export function queryMsg(data) {

}
