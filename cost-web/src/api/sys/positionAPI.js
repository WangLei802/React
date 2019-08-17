import { post, get } from '@/utils/sys/http'

export function getPositionList(params) {
  return get('/position/query', params)
}
export function setPositions(body) {
  return post('/position/user/setPositions', body)
}

export function savePosition(body) {
  return post('/position/create', body)
}

export function updatePosition(body) {
  return post('/position/update', body)
}
export function positionLifecycle(body) {
  return post('/position/status/update', body)
}
export function getPositionDetail(id) {
  return get('/position/get?id=' + id)
}
export function deletePosition(body) {
  return post('/position/delete?id=' + body)
}
export function listPositionByUser(username) {
  return get('/userposition/user/listPositions', username)
}
export function setUserPositions(body) {
  return post('/userposition/user/setPositions', body)
}
export function getOrgPositionList(param) {
  return get('/orgPosition/list', param)
}
export function getOrgName(param) {
  return get('/orgPosition/getOrgName', param)
}

export function getPositionById(param) {
  return get('/position/getPositionById', param)
}
export function getPositionListByOrgCode(params) {
  return get('/orgPosition/listIfChecked', params)
}
export function getCheckedCodes(params) {
  return get('/userposition/user/getPositionSelectedCodes', params)
}
