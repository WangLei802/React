import { get, post } from '@/utils/cost/http'

export function ticketLogin(ticket, ssourl, service) {
  let param = { ticket: ticket, service: service, ssoUrl: ssourl }
  return get('/sso/validate', param)
}
