import request from '@/utils/app-request'
import { basic_api_curve } from '@/api/base-api.js'
import { formatTimeToStr } from '@/utils/date.js'

// 获取批次列表
export function getOrderName(id) {
  var list = getOrderList()
  var label = id
  for (const index in list) {
    const item = list[index]
    if ( id === item.id) {
      return item.orderName
    }
  }
  return label
}

// 获取批次列表
export function getOrderList() {
  var list = [
    { id: 'ORDER_ID_1', orderName: '批次1', compTime: 1568103569818, pubTime: 1568116569818 },
    { id: 'ORDER_ID_2', orderName: '批次2', compTime: 1568104569818, pubTime: 1568226569818 },
    { id: 'ORDER_ID_3', orderName: '批次3', compTime: 1568107569818, pubTime: 1568336569818 },
    { id: 'ORDER_ID_4', orderName: '批次4', compTime: 1568108569818, pubTime: 1568446569818 }
  ]
  for (const index in list) {
    const item = list[index]
    if (item.compTime) {
      item.compTimeStr = formatTimeToStr(item.compTime, 'hh:mm')
    }
    if (item.pubTime) {
      item.pubTimeStr = formatTimeToStr(item.pubTime, 'hh:mm')
    }
  }
  return list
}

// 获取已关联批次
export function getProductOrderList(data) {
  return request({
    url: `${basic_api_curve}/curveProductOrder/orders`,
    method: 'post',
    data
  })
}
// 获取关键期限
export function queryProdcutKdList(data) {
  return request({
    url: `${basic_api_curve}/curveProductOrder/orderKts`,
    method: 'post',
    data
  })
}

// 查询产品-自动编制
export function queryProductOrderAutoList(data){
  return request({
    url: `${basic_api_curve}/curveProductOrderAuto/list`,
    method: 'post',
    data
  })
}

// 保存产品批次信息
export function savePrdOrder(data){
  return request({
    url: `${basic_api_curve}/curveProductOrder/save`,
    method: 'post',
    data
  })
}
