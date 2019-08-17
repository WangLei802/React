import { get } from '@/utils/sys/http'
export function getLicenseList(queryObj) {
  return get('/license/query', queryObj)
}

export function getLicenseDetail(id) {
  return get('/license/detail/' + id)
}
