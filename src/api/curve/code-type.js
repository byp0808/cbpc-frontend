/**
 * 码值数据字典公用方法
 *    add by nohi 20190910
 */
/**
 * 根据value，获取label
 * @param value
 * @param one
 * @returns {*}
 */
export function showCodeLabel(value, codeType) {
  const typeList = getCodeTypeList(codeType)
  var label = ''
  if (typeList && typeList.length > 0) {
    for (const index in typeList) {
      var item = typeList[index]
      if (item.value === value) {
        label = item.label
        break
      }
    }
  }
  if (!label) {
    return value
  }
  return label
}

/**
 * 获取码值列表
 */
export function optioins(codeType, parent) {
  console.info('codeType:' + codeType + ',parent:' + parent)
  var typeList = getCodeTypeList(codeType)
  var options = []
  if (typeList && typeList.length > 0) {
    // 根据parnt获取值
    if (parent) {
      for (const index in typeList) {
        var item = typeList[index]
        if (item.parent === parent) {
          options.push(item)
        }
      }
    } else {
      options = typeList
    }
    return options
  }
  return []
}

/**
 * 前期为临时数据，后期需要改为从缓存、实时接口中获取数据
 */
import * as CODE_TYPES from '@/api/curve/code-type-data.js'
export function getCodeTypeList(codeType) {
  const ct = CODE_TYPES[codeType]
  if (!ct) {
    console.info('CODE_TYPE【' + codeType + '】,not found')
  } else {
    return ct
  }
}

