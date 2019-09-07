import _ from 'lodash'

/**
 * 浮点加法
 */
export function add(n1, n2) {
  return _.round(_.add((n1 + 0), (n2 + 0)), 12)
}

/**
 * 浮点减法
 */
export function subtract(n1, n2) {
  return _.round(_.subtract((n1 + 0), (n2 + 0)), 12)
}

/**
 * 浮点除法
 */
export function multiply(n1, n2) {
  return _.round(_.multiply((n1 + 0), (n2 + 0)), 12)
}

/**
 * 浮点除法
 */
export function divide(n1, n2) {
  return _.round(_.divide((n1 + 0), (n2 + 0)), 12)
}
