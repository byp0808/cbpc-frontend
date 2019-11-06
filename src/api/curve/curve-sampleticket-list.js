import request from '@/utils/app-request'
import { basic_api_curve } from '@/api/base-api.js'
import { downloadFile } from '@/utils/file-request'

export function queryCurveSampleBondsList(data) {
  return request({
    url: `${basic_api_curve}/curveSampleQuery/curveSampleBondsList`,
    method: 'post',
    data
  })
}

export function downloadSample(data) {
  downloadFile(`${process.env.VUE_APP_BASE_API}${basic_api_curve}` + '/curveSampleQuery/download', data)
}