import { get, post } from '@/utils/sys/http'
export function searchApplicationList() {
  return get('/application/listAll', '')
}
export function searchApplicationModuleList(body) {
  return get('/applicationmodule/list', body)
}
export function createApplicationModule(body) {
  return post('/applicationmodule/create', body)
}
export function getApplicationModuleDetail(id) {
  return get('/applicationmodule/detail?id=' + id)
}
export function updateApplicationModule(body) {
  return post('/applicationmodule/update', body)
}

export function getApplicationModuleList(code) {
  return get('/applicationmodule/getModuleList?code=' + code)
}

