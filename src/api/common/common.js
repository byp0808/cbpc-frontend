import request from '@/utils/app-request'
import { basic_api_portal } from '@/api/base-api.js'

// 查字典
export function queryDictList(data) {
  return request({
    url: `${basic_api_portal}/sys/sys-code/dicts`,
    method: 'post',
    data
  })
}
