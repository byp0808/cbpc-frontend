import axios from 'axios'
import { Message } from 'element-ui'
import uuid from 'uuid/v4'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['token'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data

    // if the custom code is not 20000, it is judged as an error.
    if (res.flag !== 0) {
      Message({
        message: res.msg || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      // if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
      //   // to re-login
      //   MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
      //     confirmButtonText: 'Re-Login',
      //     cancelButtonText: 'Cancel',
      //     type: 'warning'
      //   }).then(() => {
      //     store.dispatch('user/resetToken').then(() => {
      //       location.reload()
      //     })
      //   })
      // }
      return Promise.reject(new Error(res.msg || 'Error'))
    } else {
      return res.data
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service

// 上传文件
export function uploadFile(url, formData) {
  formData.append('com.version', '1.0.0')
  formData.append('com.globalReqNumber', uuid())
  formData.append('com.sysIsEncrypted', '01')
  return axios.post(url, formData, { transformRequest: [function(data, headers) {
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
