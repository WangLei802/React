import { get } from '@/utils/cost/http'

// 获取列表
export function getApprove(query_obj) {
  return get('/approve/get', query_obj)
}
