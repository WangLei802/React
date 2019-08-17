import { post, get } from '@/utils/sys/http'

export function employeeList(params) {
  return get('/employee/query', params)
}
export function setSysOrButler(params) {
  return post('/employee/setSysOrButler', params)
}
export function userLifecycle(params) {
  return post('/employee/status/update', params)
}
export function resetPassword(params) {
  return post('/employee/resetPassword', params)
}
export function getUserType(body) {
  return get('/employee/getEmployeeType', body)
}
export function setUserType(body) {
  return post('/employee/setSysOrButler', body)
}
export function getById(body) {
  return get('/employee/getById', body)
}
export function getIsLogin(body) {
  return get('/employee/getIsLogin', body)
}
