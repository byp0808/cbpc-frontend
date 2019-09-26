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
export function showCodeLabel(value, codeType, $t) {
  const typeList = getCodeTypeList($t, codeType)
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
export function optioins($this, codeType, parent) {
  // console.info('codeType:' + codeType + ',parent:' + parent)
  var typeList = getCodeTypeList($this, codeType)
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
export function getCodeTypeList($this, codeType) {
  // console.info('getCodeTypeList....CODE_TYPE【' + codeType + '】')
  // 从缓存中获取数据字典
  // const dictElement = $this.$store.state.app.dict[codeType]
  let dicts = []

  // 产品线，产品组有上下级关系，特殊处理
  if (codeType !== 'PRODUCT_GROUP' && codeType !== 'BASE_PRD_CODE' && codeType !== 'MODEL') {
    if ( typeof($this.$t) === 'function') {
      dicts = $this.$t('dicts.' + codeType)
    } else if (typeof($this) === 'function') {
      dicts = this.$i18n.t('dicts.' + codeType)
    }
  }

  var options = []
  if ( typeof(dicts) !== 'string') {
    for (var key in dicts) {
      options.push({ value: key, label: dicts[key] })
    }
  }

  if (options && options.length > 0) {
    return options
  }

  console.info('CODE_TYPE【' + codeType + '】,not found in dicts , now get ti from code-type-data.js ')
  const ct = CODE_TYPES[codeType]
  if (!ct) {
    console.info('CODE_TYPE【' + codeType + '】,not found')
  } else {
    return ct
  }
}

