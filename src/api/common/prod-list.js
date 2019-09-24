import request from '@/utils/request-client'
import { basic_path } from '@/api/common/common.js'

// 根据id查产品
export function queryProdByID(data) {
  return request({
    url: `${basic_path}/prod-view/liked-prods`,
    method: 'post',
    data: data
  })
}

// 查询同部门下的产品列表
export function queryALlProductList(data) {
  return request({
    url: `${basic_path}/prod-view/all-prods`,
    method: 'post',
    data: data
  })
}
