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

// 未读消息数量
export function queryNewMsgCount(data) {
  return request({
    url: `${basic_api_market}/msg/msg-records`,
    method: 'get',
    data
  })
}

// 消息查询
export function queryMsgList(data) {
  return request({
    url: `${basic_api_market}/msg/list`,
    method: 'post',
    data
  })
}

// about
export function queryAboutInfo(data) {
  return request({
    url: `${basic_api_market}/msg/about`,
    method: 'get',
    data
  })
}

// 阅读消息
export function readMsg(data) {
  return request({
    url: `${basic_api_market}/msg/read`,
    method: 'post',
    data
  })
}

// 删除消息
export function deleteMsg(data) {
  return request({
    url: `${basic_api_market}/msg/drop`,
    method: 'post',
    data
  })
}
