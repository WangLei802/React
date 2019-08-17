import { post, get } from '@/utils/sys/http'

export function getUserDashboard() {
  return get('/userDashboard/getUserDashboard')
}

export function saveUserDashboard(obj) {
  return post('/userDashboard/create', obj)
}
export function updateUserDashboardBaseInfo(obj) {
  return post('/userDashboard/update', obj)
}

export function updateUserDashboardWidgetInfo(obj) {
  return post('/userDashboard/updateWidgetInfo', obj)
}

export function deleteUserDashboard(id) {
  return get('/userDashboard/delete/' + id)
}
