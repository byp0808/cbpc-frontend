import axios from 'axios'
import { getToken } from '@/utils/auth'
import uuid from 'uuid/v4'

export function upload({ url, data }) {
  const instance = axios.create({
    baseURL: process.env.VUE_APP_BASE_API,
    withCredentials: true
  })
  data.append('com.version', '1.0.0')
  data.append('com.globalReqNumber', uuid())
  data.append('com.sysIsEncrypted', '01')
  return instance.post(url, data, { transformRequest: [function(data, headers) {
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

function downFile(blob, fileName) {
  // 非IE下载
  if ('download' in document.createElement('a')) {
    const link = document.createElement('a')
    link.href = window.URL.createObjectURL(blob) // 创建下载的链接
    link.download = fileName // 下载后文件名
    link.style.display = 'none'
    document.body.appendChild(link)
    link.click() // 点击下载
    window.URL.revokeObjectURL(link.href) // 释放掉blob对象
    document.body.removeChild(link) // 下载完成移除元素
  } else {
    // IE10+下载
    window.navigator.msSaveBlob(blob, fileName)
  }
}

// 下载文件
export function downloadFile(url, data) {
  // 响应类型：arraybuffer, blob
  const _data = {
    data,
    com: {
      version: '1.0.0',
      globalReqNumber: uuid(),
      sysIsEncrypted: '01'
    }
  }
  axios.post(url, _data, { responseType: 'blob', headers: { token: getToken() }}).then(response => {
    const headers = response.headers
    const contentType = headers['content-type']

    console.debug('响应头信息', headers)
    if (!response.data) {
      console.error('响应异常：', response)
      return false
    } else {
      console.debug('下载文件：', response)
      const blob = new Blob([response.data], { type: contentType })

      const contentDisposition = response.headers['content-disposition']
      let fileName = 'unknown'
      if (contentDisposition) {
        fileName = window.decodeURI(response.headers['content-disposition'].split('=')[1]).replace(/\"/gi, '')
      }
      console.debug('文件名称：', fileName)
      downFile(blob, fileName)
    }
  }).catch(function(error) {
    console.log(error)
  })
}
