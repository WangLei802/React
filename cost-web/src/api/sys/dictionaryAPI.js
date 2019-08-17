import { post, get } from '@/utils/sys/http'

export function getALlDictionaryDataList() {
  return get('/dictionaryData/all')
}

export function getDictionaryTypeList(dictionaryType) {
  return get('/dictionaryType/query', dictionaryType)
}

export function getDictionaryDataList(dictionaryData) {
  return get('/dictionaryData/query', dictionaryData)
}

export function createDictionaryType(dictionaryType) {
  return post('/dictionaryType/create', dictionaryType)
}

export function updateDictionaryType(dictionaryType) {
  return post('/dictionaryType/update', dictionaryType)
}

export function createDictionaryData(dictionaryData) {
  return post('/dictionaryData/create', dictionaryData)
}

export function updateDictionaryData(dictionaryData) {
  return post('/dictionaryData/update', dictionaryData)
}

export function updateDictionaryDataStatus(dictionaryData) {
  return post('/dictionaryData/status/update', dictionaryData)
}

export function updateDictionaryTypeStatus(dictionaryType) {
  return post('/dictionaryType/status/update', dictionaryType)
}

export function getDictionaryDataDetail(id) {
  return get('/dictionaryData/detail/' + id)
}

export function getDictionaryTypeDetail(id) {
  return get('/dictionaryType/detail/' + id)
}
