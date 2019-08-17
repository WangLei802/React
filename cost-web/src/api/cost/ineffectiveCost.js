import { post, get } from '@/utils/cost/http'

export function searchAuditLogList(query_obj) {
  return get('/log/query', query_obj)
}

// 获取无效成本列表
export function getIneffectiveCostList(query_obj) {
  return get('/ineffectiveCost/list', query_obj)
}

// 保存或更新无效成本
export function saveOrUpdateIneffectiveCost(obj) {
  return post('/ineffectiveCost/saveOrUpdate', obj)
}

// 删除无效成本
export function deleteIneffectiveCost(obj) {
  return post('/ineffectiveCost/delete', obj)
}
