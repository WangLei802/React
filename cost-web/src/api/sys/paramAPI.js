import { post, get } from '@/utils/sys/http'

export function searchParameterList(params) {
  return get('/parameter/query', params)
}

export function updateParameter(params) {
  return post('/parameter/update', params)
}

export function saveParameter(params) {
  return post('/parameter/create', params)
}

export function deleteParameter(id) {
  return get('/parameter/remove/' + id)
}

export function getDetail(id) {
  return get('/parameter/detail/' + id)
}

export function getAllParameters() {
  return get('/parameter/listAll')
}
