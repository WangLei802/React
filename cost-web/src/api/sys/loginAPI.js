
import { post_param, post, get } from '@/utils/sys/http'

export function login(username, password) {
  let param = {
    username: username, password: password
  }
  return post_param('/login', param)
}
export function ticketLogin(ticket, ssourl, service) {
  let param = { ticket: ticket, service: service, ssoUrl: ssourl }
  return get('/sso/validate', param)
}
export function getInfo(token) {
  return get('/me/')
}

export function logout() {
  return post('/logout')
}

export function logetInitData() {
  return get('/firstpage/getInitData')
}
export function getLicese() {
  return get('/getLicese')
}
