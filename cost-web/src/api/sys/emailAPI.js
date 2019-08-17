import { get } from '@/utils/sys/http'

export function getEmailList(params) {
  return get('/email/query', params)
}

export function getEmailDetail(id) {
  return get('/email/detail/' + id)
}
