import { post as commonPost, get as commonGet } from '@/utils/sys/http'

export function post(url, param = '') {
  return commonPost(url, param, process.env.COST_API)
}

export function get(url, param = '') {
  return commonGet(url, param, process.env.COST_API)
}
