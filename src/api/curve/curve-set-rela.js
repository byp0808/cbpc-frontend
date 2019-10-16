import request from '@/utils/app-request'
import { basic_api_curve } from '@/api/base-api.js'

/**
 * 获取指定长度的字符串
 * @param num
 * @param n
 * @returns {string}
 */
export function rpad(num, n) {
  var len = num.toString().length
  while (len < n) {
    num = num + '0'
    len++
  }
  return num
}

// 解析产品评级，返回数字判断大小
export function resolveProductGrade2Num(grade) {
  var len = grade.length
  var last_Char = grade[len - 1]
  grade = grade.replace(/[^ABC]/g, '')
  grade = rpad(grade, 3)
  grade = grade.replace(/[A]/g, '8')
  grade = grade.replace(/[B]/g, '6')
  grade = grade.replace(/[C]/g, '4')

  grade = Number(grade)
  if (last_Char === '+') {
    grade = grade + 1
  } else if (last_Char === '-') {
    grade = grade - 1
  }
  return grade
}

// 排序关键期限
export function sortStandSlip(a, b) {
  return Number(a) - Number(b)
}

// 保存
export function saveRelaTempMain(data) {
  return request({
    url: `${basic_api_curve}/curveRelaTemp/insertCurveRelaTemp`,
    method: 'post',
    data
  })
}

// 根据tempMainId 获取关系主表
export function getRelaTempMain(id) {
  return request({
    url: `${basic_api_curve}/curveRelaTemp/get/` + id,
    method: 'get'
  })
}

// 获取关系模板列表
export function tempList(data) {
  return request({
    url: `${basic_api_curve}/curveRelaTemp/tempList`,
    method: 'post',
    data
  })
}

// 获取关系模板产品列表
export function prdList(data) {
  return request({
    url: `${basic_api_curve}/curveRelaTemp/prdList`,
    method: 'post',
    data
  })
}

// 获取关系模板关键期限列表
export function kdList(data) {
  return request({
    url: `${basic_api_curve}/curveRelaTemp/kdList`,
    method: 'post',
    data
  })
}