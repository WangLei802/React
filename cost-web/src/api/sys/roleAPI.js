import { post, get } from '@/utils/sys/http'

export function getRoleList(params) {
  return get('/role/query', params)
}

export function deleteRole(params) {
  return get('/role/delete', params)
}

export function getUserRoleList(username) {
  return get('/userrole/user/listRoles', username)
}

export function setRoles(body) {
  return post('/userrole/user/setRoles', body)
}

export function saveRole(body) {
  return post('/role/create', body)
}

export function updateRole(body) {
  return post('/role/update', body)
}
export function roleLifecycle(body) {
  return post('/role/status/update', body)
}

export function getRoleDetail(id) {
  return get('/role/detail/' + id)
}

export function getRoleUserList(params) {
  return get('/userrole/user/list', params)
}
export function unbindRoleUser(body) {
  return post('/userrole/user/unbind', body)
}

export function getRoleUserUnbindList(params) {
  return get('/userrole/user/unbindList', params)
}

export function bindRoleUser(body) {
  return post('/userrole/user/bind', body)
}

