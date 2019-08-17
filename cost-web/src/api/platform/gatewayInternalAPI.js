import { post, get } from '@/utils/sys/http'

export function getGatewayInternalList(params) {
  return get('/gateway/internal/listAll', params)
}

export function deleteGatewayInternal(params) {
  return post('/gateway/internal/delete', params)
}

export function saveGatewayInternal(body) {
  return post('/gateway/internal/create', body)
}

export function updateGatewayInternal(body) {
  return post('/gateway/internal/update', body)
}

export function getGatewayInternalDetail(params) {
  return get('/gateway/internal/get', params)
}

export function updateGatewayInternalStatus(params) {
  return post('/gateway/internal/status/update', params)
}

export function refreshGateway() {
  return get('/refreshRoute', '', process.env.BASE_PREFIX)
}
