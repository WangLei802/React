import { get,post } from '@/utils/sys/http'
export function getAllClientRouters() {
  return get('/client/router/listAll')
}
export function saveClientRouter(params) {
  return post('/client/router/create',params)
}
export function getClientRouterDetail(id) {
  return get('/client/router/detail?id=' + id)
}
export function updateClientRouter(params) {
  return post('/client/router/update',params)
}
export function deleteClientRouter(id) {
  return get('/client/router/delete?id='+id)
}
