import { post, get } from '@/utils/sys/http'

// 新增资源
export function createResource(params) {
  return post('/resourceentity/create', params)
}
// 修改资源
export function updateResource(params) {
  return post('/resourceentity/update', params)
}

// 删除资源
export function deleteResource(params) {
  return post('/resourceentity/delete', params)
}

export function getListByMenuId(params) {
  return get('/resourceentity/getListByMenuId', params)
}
// 根据menuId该资源下没有的API
export function listApiByMenuId(params) {
  return get('/resourceentity/listApiByMenuId', params)
}
// 根据menuId该资源下没有的API组
export function listGroupApiByMenuId(params) {
  return get('/resourceentity/listGroupApiByMenuId', params)
}

export function getList(params) {
  return get('/resource/list', params)
}

export function saveResource(body) {
  return post('/resource/create', body)
}
//
// export function updateResource(body) {
//   return post('/resource/update', body)
// }

// export function deleteResource(body) {
//   return post('/resource/delete', body)
// }

export function getApiList(params) {
  return get('/applicationapi/list', params)
}

export function getAppModuleList(params) {
  return get('/applicationmodule/list', params)
}

export function getAppList(params) {
  return get('/application/listAll', params)
}
