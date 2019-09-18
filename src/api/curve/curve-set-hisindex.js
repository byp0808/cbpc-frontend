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

