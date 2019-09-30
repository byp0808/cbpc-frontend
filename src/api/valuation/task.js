import request from '@/utils/app-request'
import { basic_api_valuation } from '@/api/base-api.js'

export function getAllTableList(data) {
  return request(
    {
      url: `${basic_api_valuation}/task/list`,
      method: 'post',
      data: data
    }
  )
}

