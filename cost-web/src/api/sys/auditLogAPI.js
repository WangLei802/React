import { get } from '@/utils/sys/http'
export function searchAuditLogList(query_obj) {
  return get('/log/query', query_obj)
}

export function AuditLoginfo(id) {
  return get('/log/detail/' + id)
}
