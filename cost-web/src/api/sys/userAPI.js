import { post, get } from '@/utils/sys/http'

export function getMeProfile() {
  return get('/me/')
}
export function newOrUpdateUserProfile(user) {
  return post('/me/update', user)
}
export function updatePassword(model) {
  return post('/me/changePassword', model)
}
