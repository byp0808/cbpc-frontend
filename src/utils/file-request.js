import axios from 'axios'
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
  instance.post(url, fd).then(res => {
  })
}

