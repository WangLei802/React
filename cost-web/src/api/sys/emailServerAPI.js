import { post, get } from '@/utils/sys/http'

export function searchEmailServerList() {
  return get('/emailServer/query')
}

export function updateEmailServer(body) {
  return post('/emailServer/update', body)
}

export function createEmailServer(body) {
  return post('/emailServer/create', body)
}

export function updateEmailServerStatus(body) {
  return post('/emailServer/status', body)
}

export function deleteEmailServer(body) {
  return post('/emailServer/delete', body)
}

export function queryEmailServerDetail(id) {
  return get('/emailServer/detail/' + id)
}
