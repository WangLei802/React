import { getLocalItem, Constants } from '@/utils/common/cache'

// 花括号必须成对出现，sentence为需要替换的字符串
export function replaceAllKeyToValue(sentence) {
  sentence = sentence.split('{')
  let value = sentence[0]
  for (var i = 1; i < sentence.length; i++) {
    let key = sentence[i].split('}')
    value += (getLangValue(key[0]) || `{${key[0]}}`) + key[1]
  }
  return value
}

export function getLangValue(key, placeholder) {
  var data = getLocalItem(Constants.I18N_DATA)
  var locale = getLocalItem(Constants.LOCALE) || 'cn'
  if (data) {
    var dataObject = JSON.parse(data)
    var localeData = dataObject.messages[locale]

    var langData = localeData.multilang

    var result = langData[key]
    if (result) {
      result = formatI18N(result, placeholder)
    } else {
      result = key
    }
    return result
  }
  return key
}

export function formatI18N(value, placeholder) {
  if (!value) {
    return ''
  }
  if (!placeholder) {
    return value
  }
  if (typeof (placeholder) === 'object') {
    for (var key in placeholder) {
      value = value.replace(new RegExp('\\{' + key + '\\}', 'g'), placeholder[key])
    }
    return value
  } else {
    for (var i = 0; i < placeholder.length; i++) {
      value = value.replace(new RegExp('\\{' + i + '\\}', 'g'), placeholder[i])
    }
    return value
  }
}
