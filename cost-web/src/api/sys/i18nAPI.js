import { post, get } from '@/utils/sys/http'

export function changeLocale(locale) {
  if (locale === 'cn') {
    return 'en'
  } else {
    return 'cn'
  }
}

export function getLocale() {
  return get('/i18n')
}

export function getLangDetail(id) {
  return get('/i18n/detail/' + id)
}

export function searchLangList(queryObj) {
  return get('/i18n/query', queryObj)
}
export function saveLang(obj) {
  return post('/i18n/create', obj)
}
export function updateLang(obj) {
  return post('/i18n/update', obj)
}
export function deleteLang(id) {
  return post('/i18n/delete/' + id)
}

export function getLangTypeDetail(id) {
  return get('/langType/detail/' + id)
}

export function getLangTypeList() {
  return post('/langType/queryUsedAndActive')
}
export function searchLangTypeList() {
  return get('/langType/queryUsed')
}
export function getUnUsedLangTypeList() {
  return get('/langType/queryUnUsed')
}
export function newOrUpdateLangType(params) {
  return post('/langType/create', params)
}
export function activeLangType(id) {
  return post('/langType/updateStatusActive/' + id)
}
export function deActiveLangType(id) {
  return post('/langType/updateStatusDeActive/' + id)
}
export function setDefaultLangType(id) {
  return post('/langType/updateSetDefault/' + id)
}
