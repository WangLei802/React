import { post, get } from '@/utils/sys/http'

const prefix = '/gateway/external'

export function listAll(params) {
  return get(prefix + '/listAll', params)
}

export function remove(params) {
  return post(prefix + '/delete', params)
}

export function create(body) {
  return post(prefix + '/create', body)
}

export function update(body) {
  return post(prefix + '/update', body)
}

export function detail(params) {
  return get(prefix + '/get', params)
}
