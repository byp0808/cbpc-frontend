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

export function sortStandSlip(a,b) {
  return Number(a) - Number(b)
}