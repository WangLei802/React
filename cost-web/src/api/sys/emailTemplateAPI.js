import { post, get } from '@/utils/sys/http'

export function searchEmailTemplateList(params) {
  return get('/emailTemplate/query', params)
}

export function updateEmaileTemplate(params) {
  return post('/emailTemplate/update', params)
}

export function createEmaileTemplate(params) {
  return post('/emailTemplate/create', params)
}

export function deleteEmaileTemplate(params) {
  return get('/emailTemplate/delete', params)
}

export function queryEmailTemplateDetail(id) {
  return get('/emailTemplate/detail/' + id)
}
