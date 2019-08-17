import { post, get } from '@/utils/sys/http'

export function searchDashboardList(queryObj) {
  return get('/systemDashboard/query', queryObj)
}

export function getDashboardDetail(id) {
  return get('/systemDashboard/detail/' + id)
}

export function saveDashboard(obj) {
  return post('/systemDashboard/create', obj)
}
export function updateDashboardBaseInfo(obj) {
  return post('/systemDashboard/update', obj)
}

export function updateDashboardWidgetInfo(obj) {
  return post('/systemDashboard/updateWidgetInfo', obj)
}

export function setDefaultDashboard(id) {
  return post('/systemDashboard/setDefault/' + id)
}

export function deleteDashboard(id) {
  return get('/systemDashboard/delete/' + id)
}
