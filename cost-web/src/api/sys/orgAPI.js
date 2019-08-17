import { post, get } from '@/utils/sys/http'

export function searchManageOrgList() {
  return post('/org/query')
}

export function addOrg(params) {
  return post('/org/create', params)
}

export function enableOrgList(params) {
  return post('/org/enable', params)
}

export function disableOrgList(params) {
  return post('/org/disable', params)
}

export function getTopOrgList(params) {
  return get('/org/getManagerOrgList')
}

export function updateTopOrgList(params) {
  return post('/org/update', params)
}

export function getOrgById(params) {
  return get('/org/get', params)
}

export function getClientRouterList(params) {
  return get('/client/router/listAll', params)
}
export function setOrgs(params) {
  return post('/org/user/setOrgs', params)
}
export function getUserOrgList(params) {
  return get('/org/user/listUserOrgs', params)
}
export function setfirstSetOrg(params) {
  return post('/org/user/firstSetOrg', params)
}
export function getCheckedValues(params) {
  return get('/org/user/listChecked', params)
}
// 用户管理
export function listPositions(params) {
  return get('/userposition/user/listPositions', params)
}
// 岗位
export function positionListAll(params) {
  return get('/position/listAll', params)
}

export function setPositions(params) {
  return post('/userposition/user/setPositions', params)
}
export function getUsersByPositionCode(params) {
  return get('/userposition/user/getUsersByPositionCode', params)
}
export function orgPositionList(params) {
  return get('/orgPosition/list', params)
}
export function getOrgName(params) {
  return get('/orgPosition/getOrgName', params)
}
