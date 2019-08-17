import { setLocalItem, getLocalItem, Constants } from '@/utils/common/cache'
import { getALlDictionaryDataList } from '@/api/sys/dictionaryAPI'
import Vue from 'vue'
export function getAllDictionaryDatasFromUrl() {
  try {
    getALlDictionaryDataList().then(response => {
      const data = response.data || []
      let dataMapping = {}
      data.forEach((v, k) => {
        dataMapping[v.dictType + v.dictValue] = v
        // 根据字典类型返回列表
        if (v.status === '1') {
          dataMapping[v.dictType] ? dataMapping[v.dictType].push(v) : dataMapping[v.dictType] = [v]
        }
      })
      setLocalItem(Constants.DICTIONARY, JSON.stringify(dataMapping))
    }).catch(error => {
      console.log(error)
    })
  } catch (e) {
    console.log(e)
  }
}

export function getAllDictionaryDatas() {
  var data = getLocalItem(Constants.DICTIONARY)
  if (data === null || data.length === 0) {
    getAllDictionaryDatasFromUrl() // 获取字典数据
    return
  }
  return JSON.parse(getLocalItem(Constants.DICTIONARY))
}

/**
 * 根据字典类型获取字典数据列表，只返回有效的列表数据
 * @param type
 * @returns {*}
 */
Vue.prototype.$getDictionaryListByType = function(type) {
  var data = getAllDictionaryDatas()
  if (data === null) {
    return []
  }
  var list = data[type] || []
  return list.sort((a, b) => {
    return a.treeSort - b.treeSort
  })
}

/**
 * 根据字典类型和字典code返回对应的字典值
 * @param type
 * @param key
 * @returns {*}
 */
Vue.prototype.$getDictionaryLabel = function(type, key) {
  var data = getAllDictionaryDatas()
  if (data === null) {
    return ''
  }
  var model = data[type + key]
  var content = ''
  if (model != null) {
    content = this.$checkLocaleIsCn() ? model.dictLabelCn : model.dictLabelEn
  }
  return content
}
