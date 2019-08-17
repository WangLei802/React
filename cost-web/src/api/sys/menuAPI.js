import { post, get } from '@/utils/sys/http'

export function searchManageMenuList() {
  return post('/menu/query')
}

export function addMenu(params) {
  return post('/menu/add', params)
}

export function weightDictType() {
  return get('/dictionaryData/getData?dictType=dictType=sys_menu_weight')
}

export function enableMenuList(params) {
  return get('/menu/enable/' + params)
}

export function disableMenuList(params) {
  return get('/menu/disable/' + params)
}

export function getTopMenuList(params) {
  return get('/menu/getManageMenuList')
}

export function updateTopMenuList(params) {
  return post('/menu/update', params)
}

export function getMenuById(params) {
  return get('/menu/get', params)
}

export function getClientRouterList(params) {
  return get('/client/router/listAll', params)
}
