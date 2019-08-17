import { get } from '@/utils/cost/http'

// 查询附件
export function getAttachment(obj) {
  return get('/attachment/get', obj)
}
