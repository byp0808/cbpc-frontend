import request from '@/utils/app-request'

export function getLanguagePack() {
  return request({
    url: 'pi-sys/sys/sys-code/language',
    method: 'get'
  })
}

export function getDicts() {
  return request({
    url: '/pi-sys/sys/sys-code/all-dict',
    method: 'get'
  })
}
