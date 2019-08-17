import { post, get } from '@/utils/sys/http'

export function saveWidget(obj) {
  return post('/widget/create', obj)
}
export function updateWidget(obj) {
  return post('/widget/update', obj)
}
export function deleteWidget(id) {
  return post('/widget/delete/' + id)
}
export function searchWidgetList(queryObj) {
  return get('/widget/query', queryObj)
}

export function updateStatus(id) {
  return post('/widget/status/update/' + id)
}

export function getWidgetDetail(id) {
  return get('/widget/detail/' + id)
}
