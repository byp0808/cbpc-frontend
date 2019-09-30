import request from '@/utils/app-request'
import { basic_api_curve } from '@/api/base-api.js'

export function queryCurveSampleBondsList(data) {
  return request({
    url: `${basic_api_curve}/curveProduct/curveSampleBondsList`,
    method: 'post',
    data
  })

  /* return {
        flag: 0,
        data: {
          dataList: [{
            id: 'curve1',
            prdCode: '曲线一'
          },
          {
            id: 'curve2',
            prdCode: '曲线二'
          },
          {
            id: 'curve3',
            prdCode: '曲线三'
          },
          {
            id: 'curve4',
            prdCode: '曲线四'
          }]
        }
      }*/
}
