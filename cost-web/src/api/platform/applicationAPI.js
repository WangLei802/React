import { post, get } from '@/utils/sys/http'

export function getApplicationList(params) {
  return get('/application/listAll', params)
}

export function saveApplication(body) {
  return post('/application/create', body)
}

export function updateApplication(body) {
  return post('/application/update', body)
}

export function getApplicationDetail(id) {
  return get('/application/get?id=' + id)
}
