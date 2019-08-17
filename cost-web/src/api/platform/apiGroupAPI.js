
import { post, get } from '@/utils/sys/http'

// 获取api组列表，分页
export function getApplicationAPIGroupList(param) {
  return get('/applicationapigroup/list', param)
}

// 新建api组
export function createApiGroup(param) {
  return post('/applicationapigroup/create', param)
}

// 更新api组
export function updateApiGroup(param) {
  return post('/applicationapigroup/update', param)
}

// 删除api组
export function deleteApiGroup(param) {
  return post('/applicationapigroup/delete', param)
}

// API组分配API
export function addApi(param) {
  return post('/applicationapigroupapi/addApi', param)
}
// 查询关联API
// groupId
export function existApiList(param) {
  return get('/applicationapigroupapi/existApiList', param)
}

// 查询非关联API
export function notExistApiList(param) {
  return get('/applicationapigroupapi/notExistApiList', param)
}

// 删除关联API
export function deleteApi(param) {
  return post('/applicationapigroupapi/deleteApi', param)
}

// 根据id查找API组
export function getById(param) {
  return get('/applicationapigroup/getById', param)
}

