import request from '@/utils/app-request'
import { basic_api_curve, basic_api_market } from '@/api/base-api.js'

// 查询曲线产品列表,获取下拉
export function getCurveList(data) {
  if (!data) {
    data = { search_approveStatus_EQ: '02' }
  } else {
    data.search_approveStatus_EQ = '02'
  }
  return request({
    url: `${basic_api_curve}/curveProduct/curveList`,
    method: 'post',
    data
  })
}

// 查询曲线产品列表
export function queryCurveProductList(data) {
  return request({
    url: `${basic_api_curve}/curveProduct/productList`,
    method: 'post',
    data
  })
}
// 保存曲线产品
export function saveProductInfo(data) {
  return request({
    url: `${basic_api_curve}/curveProduct/storageCurveInfo`,
    method: 'post',
    data
  })
}

// 曲线产品确认
export function confirmCurveInfo(productId) {
  return request({
    url: `${basic_api_curve}/curveProduct/confirmCurveInfo/` + productId,
    method: 'post'
  })
}

// 查询曲线产品列表,包含样本券
export function finishCurveInfo(data) {
  return request({
    url: `${basic_api_curve}/curveProduct/finishCurveInfo`,
    method: 'post',
    data
  })
}

// 删除曲线产品
export function delCurveProduct(id) {
  return request({
    url: `${basic_api_curve}/curveProduct/delete/` + id,
    method: 'delete'
  })
}

// 查询曲线产品信息
export function getCurveProduct(id) {
  return request({
    url: `${basic_api_curve}/curveProduct/get/` + id,
    method: 'get',
    params: { id: id }
  })
}
// 获取曲线产品列表，仅包含曲线产品，key为曲线产品编号
export function getCurveProductOptions() {
  const options = []
  getCurveList({ search_approveStatus_EQ: '02' }).then(response => {
    response.map(data => options.push({ value: data.curvePrdCode, label: data.productName }))
  })
  return options
}

// 获取曲线产品列表，仅包含曲线产品，key为曲线产品ID
export function getCurveProductIdOptions() {
  const options = []
  getCurveList({}).then(response => {
    response.map(data => options.push({ value: data.curveId, label: data.productName, curveId: data.curveId, productName: data.productName, productGrade: data.productGrade }))
  })
  return options
}

// 获取曲线产品、批次列表
export function getCurveOrderList(data) {
  return request({
    url: `${basic_api_curve}/curveProduct/selectCurveAndOrder`,
    method: 'post',
    data
  })
}

// 保存曲线类型
export function storageCurveInfo(data) {
  return request({
    url: `${basic_api_curve}/curveProduct/storageCurveInfo`,
    method: 'post',
    data
  })
}

// 查询曲线产品关键期限
export function queryCurvePrdKd(data) {
  return request({
    url: `${basic_api_curve}/curveProduct/curvePrdKdList`,
    method: 'post',
    data
  })
}

// 查询曲线产品远期期限
export function queryCurvePrdNk(data) {
  return request({
    url: `${basic_api_curve}/curveProduct/curvePrdNkList`,
    method: 'post',
    data
  })
}

// 定义曲线产品关键期限
export function defCurvePeriod(data) {
  return request({
    url: `${basic_api_curve}/curveProduct/defCurvePeriod`,
    method: 'post',
    data
  })
}

// 查询同调曲线dto列表
export function querycurveHomologyDto(data) {
  return request({
    url: `${basic_api_curve}/curveHomology/queryCurveHomologyDto`,
    method: 'post',
    data
  })
}

// 删除同调曲线dto列表
export function delcurveHomologyDto(data) {
  return request({
    url: `${basic_api_curve}/curveHomology/delcurveHomologyDto`,
    method: 'post',
    data
  })
}

// 查询同调曲线列表
export function querycurveHomology(data) {
  return request({
    url: `${basic_api_curve}/curveHomology/queryCurveHomology`,
    method: 'post',
    data
  })
}

// 查询同调曲线主表信息
export function querycurveHomologyMain(id) {
  return request({
    url: `${basic_api_curve}/curveHomology/get/` + id,
    method: 'get'
  })
}

// 同调曲线保存并发起流程
export function storageHomology(data) {
  return request({
    url: `${basic_api_curve}/curveHomology/storageHomology`,
    method: 'post',
    data
  })
}
// 同调曲线流程审批
export function finishHomology(data) {
  return request({
    url: `${basic_api_curve}/curveHomology/finishHomology`,
    method: 'post',
    data
  })
}

// 查询参考曲线dto列表
export function queryCurveReferDto(data) {
  return request({
    url: `${basic_api_curve}/curveRefer/queryCurveReferDto`,
    method: 'post',
    data
  })
}

// 查询参考曲线主表流程信息
export function queryCurveReferMainInfo(id) {
  return request({
    url: `${basic_api_curve}/curveRefer/get/` + id,
    method: 'get'
  })
}

// 删除参考曲线dto列表
export function delCurveReferDto(data) {
  return request({
    url: `${basic_api_curve}/curveRefer/delCurveReferDto`,
    method: 'post',
    data
  })
}

// 查询参考曲线列表
export function queryCurveRefer(data) {
  return request({
    url: `${basic_api_curve}/curveRefer/queryCurveRefer`,
    method: 'post',
    data
  })
}

// 参考曲线保存并发起流程
export function storageRefer(data) {
  return request({
    url: `${basic_api_curve}/curveRefer/storageRefer`,
    method: 'post',
    data
  })
}
// 参考曲线流程审批
export function finishRefer(data) {
  return request({
    url: `${basic_api_curve}/curveRefer/finishRefer`,
    method: 'post',
    data
  })
}

// 从行情应用获取关键期限模板
// TODO 改为接口获取值
export function prdKdModsList(data) {
  return request({
    url: `${basic_api_market}/curve-temp/kd-list`,
    method: 'post',
    data
  })
}

// 远期NK模板列表
// TODO 改为接口获取值
export function forwardFlagModsList(data) {
  console.info('远期NK模板列表，后期需要改为接口')
  // return [
  //   { label: '模板一', key: '0001' },
  //   { label: '模板二', key: '0002' },
  //   { label: '模板三', key: '0003' },
  //   { label: '模板四', key: '0004' }
  // ]
  return request({
    url: `${basic_api_market}/curve-temp/nk-list`,
    method: 'post',
    data
  })
}

// 根据远期NK模板ID，获取列表
// TODO 改为接口获取值
export function getCurvePrdNkListByModId(id) {
  console.info('根据远期NK模板ID，获取列表：' + id + '，后期需要改为接口')
  return [
    { nvalue: '0', kvalue: '11', operateTs: 1568968332449, remark: '' },
    { nvalue: '12', kvalue: '33', operateTs: 1568968332449, remark: '' },
    { nvalue: '13', kvalue: '0', operateTs: 1568968332449, remark: '' }
  ]
}

// 获取信用债初始化方案列表
export function getInitPageList(data) {
  return request({
    url: `${basic_api_curve}/curveSetInit/initPageList`,
    method: 'post',
    data
  })
}

// 获取信用债初始化方案公式列表
export function getInitFormulaList(data) {
  return request({
    url: `${basic_api_curve}/curveSetInit/initFormulaList`,
    method: 'post',
    data
  })
}

// 获取信用债初始化方案明细列表
export function getInitDetailList(data) {
  return request({
    url: `${basic_api_curve}/curveSetInit/initDetailList`,
    method: 'post',
    data
  })
}

// 根据ID获取初始化方案记录
export function getInitIdlList(id) {
  return request({
    url: `${basic_api_curve}/curveSetInit/getInit/${id}`,
    method: 'get'
  })
}

// 保存初始化方案信息
export function storageInitList(data) {
  return request({
    url: `${basic_api_curve}/curveSetInit/save`,
    method: 'post',
    data
  })
}

// 审批流程完成
export function getTaskFinsih(data) {
  return request({
    url: `${basic_api_curve}/curveSetInit/taskFinsih`,
    method: 'post',
    data
  })
}

// 删除方案信息
export function delInitList(id) {
  return request({
    url: `${basic_api_curve}/curveSetInit/delete` + id,
    method: 'delete'
  })
}
// 获取初始化列表，仅包含曲线产品，key为曲线产品编号
export function getCurveInitOptions() {
  var options = []
  getCurveList({}).then(response => {
    var datalist = response
    if (datalist && datalist.length > 0) {
      for (var i = 0; i < datalist.length; i++) {
        var data = datalist[i]
        options.push({ data })
      }
    }
  })
  return options
}

// 获取初始化列表，仅包含曲线产品，key为曲线产品编号
export function getDetalInitOptions() {
  var options = []
  getInitDetailList({}).then(response => {
    var datalist = response
    if (datalist && datalist.length > 0) {
      for (var i = 0; i < datalist.length; i++) {
        var data = datalist[i]
        options.push({ data })
      }
    }
  })
  return options
}

// 获取初同调曲线始化列表，仅包含曲线产品，key为曲线产品编号
export function getQueryCurvOptions(news) {
  var options = []
  querycurveHomology(news).then(response => {
    var datalist = response.dataList
    if (datalist && datalist.length > 0) {
      for (var i = 0; i < datalist.length; i++) {
        var item = datalist[i]
        options.push({ label: item.productName, value: item.curveId })
      }
    }
  })
  return options
}
