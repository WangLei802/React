import { post, get } from '@/utils/sys/http'

export function queryMenuList(params) {
  return get('/roleResAuth/menuList', params)
}

export function updateRoleResAuth(params) {
  return post('/roleResAuth/update', params)
}
export function getResourceByMenuId(params) {
  return get('/roleResAuth/getResourceByMenuId', params)
}
