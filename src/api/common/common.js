import request from '@/utils/app-request'
import { basic_api_portal } from '@/api/base-api.js'
import { upload } from '@/utils/file-request.js'

// 查字典
export function queryDictList(data) {
  return request({
    url: `${basic_api_portal}/sys/sys-code/dicts`,
    method: 'post',
    data
  })
}

// 文件上传
export function uploadFile(data) {
  const form = new FormData()
  form.append('file', data.file)
  form.append('zone', 'pek3b')
  form.append('bucketName', 'leewd-test')
  return upload({
    url: `${basic_api_portal}/pi-sys/common/attach/upload`,
    method: 'post',
    data: form
  })
}
