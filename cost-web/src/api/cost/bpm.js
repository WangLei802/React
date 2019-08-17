import { post, get } from '@/utils/cost/http'



// 获取列表
export function getAllList(query_obj) {
  return post('/bpm/list', query_obj)
}

// 获取列表
export function callBpm(query_obj) {
  return post('/bpm/call', query_obj)
}
