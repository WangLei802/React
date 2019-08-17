
import { post, get } from '@/utils/sys/http'

export function getApplicationAPIList(params) {
  return get('/applicationapi/list', params)
}

export function saveApplicationAPI(body) {
  return post('/applicationapi/create', body)
}

export function updateApplicationAPI(body) {
  return post('/applicationapi/update', body)
}

export function getApplicationAPIDetail(id) {
  return get('/applicationapi/get?id=' + id)
}

