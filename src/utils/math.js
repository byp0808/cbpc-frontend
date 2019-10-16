import _ from 'lodash'

/**
 * 浮点加法
 */
export function add(n1, n2) {
  return _.round(_.add((n1 - 0), (n2 - 0)), 12)
}

/**
 * 浮点减法
 */
export function subtract(n1, n2) {
  return _.round(_.subtract((n1 - 0), (n2 - 0)), 12)
}

/**
 * 浮点除法
 */
export function multiply(n1, n2) {
  return _.round(_.multiply((n1 - 0), (n2 - 0)), 12)
}

/**
 * 浮点除法
 */
export function divide(n1, n2) {
  return _.round(_.divide((n1 - 0), (n2 - 0)), 12)
}

/**
 * 計算加總與平均數
 */
export function getMean(arr) {
  const sum = arr.reduce((acc, cur) => acc + cur)
  const mean = sum / arr.length
  // 取到小數第二位
  return _.round((mean * 100) / 100, 12)
}

/**
 * 計算中位數
 */
export function getMedian(arr) {
  const a = arr.sort((a, b) => a - b)
  if (a.length % 2 === 0) {
    // 數目為偶數
    return (a[a.length / 2] + a[a.length / 2 - 1]) / 2
  } else {
    // 數目為奇數
    return a[(a.length - 1) / 2]
  }
}

/**
 * 計算眾數
 */
export function getMode(arr) {
  const countList = {}
  for (let value of arr) {
    value = value.toString()
    if (!countList[value]) countList[value] = 0
    countList[value]++
  }
  let maxCount = 0
  let mode = []
  for (const prop in countList) {
    if (maxCount < countList[prop]) {
      maxCount = countList[prop]
      mode = [prop]
    } else if (maxCount === countList[prop]) {
      mode.push(prop)
    }
  }
  if (mode.length === Object.keys(countList).length) {
    mode = []
  }
  return mode
}
