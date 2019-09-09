import request from '@/utils/request-client'
import uuid from 'uuid/v4'

request.interceptors.request.use(config => {
  if (config.data) {
    const _data = config.data
    config.data = {
      data: _data,
      com: {
        version: '1.0.0',
        globalReqNumber: uuid(),
        sysIsEncrypted: '01'
      }
    }
  }
  return config
})

export default request
