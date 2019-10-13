import request from '@/utils/app-request'
import { basic_api_valuation } from '@/api/base-api.js'
import { upload } from '@/utils/file-request.js'

export function queryReportList(data) {
  return request({
    url: `${basic_api_valuation}/report/list`,
    method: 'post',
    data: data
  })
}

export function queryReport(data) {
  return request({
    url: `${basic_api_valuation}/report/get-one`,
    method: 'post',
    data
  })
}

export function uploadReport(data) {
  return upload({
    url: `${basic_api_valuation}/report/upload`,
    data
  })
}

export function deleteReport(data) {
  return request({
    url: `${basic_api_valuation}/report/del`,
    method: 'post',
    data
  })
}

export function previewReport(data) {
  return request({
    url: `${basic_api_valuation}/report/preview`,
    method: 'post',
    data
  })
}

// 启用或停用
export function switchStatus(data) {
  return request({
    url: `${basic_api_valuation}/report/switch`,
    method: 'post',
    data
  })
}

export function taskSubmit(data) {
  return request({
    url: `${basic_api_valuation}/report/roam-task`,
    method: 'post',
    data
  })
}
