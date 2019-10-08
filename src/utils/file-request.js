import axios from 'axios'
import { getToken } from '@/utils/auth'
import uuid from 'uuid/v4'

export function upload({ url, data }) {
  const instance = axios.create({
    baseURL: process.env.VUE_APP_BASE_API,
    withCredentials: true
  })
  const fd = new FormData()
  fd.append('data', data)
  fd.append('com', {
    version: '1.0.0',
    globalReqNumber: uuid(),
    sysIsEncrypted: '01'
  })

  return instance.post(url, fd, { transformRequest: [function(data, headers) {
    if (headers['Content-Type'] === 'multipart/form-data') {
      return data
    } else {
      headers['Content-Type'] = 'application/json'
    }
    return JSON.stringify(data)
  }], headers: { 'Content-Type': 'multipart/form-data', token: getToken() }}).then(response => {
    const res = response.data
    console.log('response: ', res)
    if (res.flag !== 0) {
      return Promise.reject(new Error(res.msg || 'Error'))
    } else {
      return res.data
    }
  }).catch(message => {
    console.log('message: ', message)
    this.$message.error('上传失败，请联系管理员')
  })
}

