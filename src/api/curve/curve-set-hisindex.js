import request from '@/utils/app-request'

const basic_api_curve = '/pi-curve'

// 计算历史分位点
export function computeHisIndex(data) {
  return request({
    url: `${basic_api_curve}` + '/curveSet/computeHisIndex',
    method: 'post',
    data: data
  })
}

// 加载本部门配置
export function getCurveSetHisIndexByOrgId(data) {
  return request({
    url: `${basic_api_curve}` + '/curveSet/getByOrgId',
    method: 'post',
    data: data
  })
}

// 保存本部门配置
export function saveCurveSetHisIndexByOrgId(data) {
  return request({
    url: `${basic_api_curve}` + '/curveSet/save',
    method: 'post',
    data: data
  })
}
