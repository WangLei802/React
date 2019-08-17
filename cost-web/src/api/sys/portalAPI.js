import { post, get } from '@/utils/sys/http'
export function getPortal() {
  return get('/portal/get')
}
export function getMenu() {
  return get('/menu/list')
}
