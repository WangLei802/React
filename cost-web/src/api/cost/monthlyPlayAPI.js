import { post, get } from '@/utils/cost/http'

export function searchAuditLogList(query_obj) {
  return get('/log/query', query_obj)
}

// 获取列表
export function getMonthlyPlayList(query_obj) {
  return get('/paymentMonthYear/list', query_obj)
}

// 保存或更新(新增)
export function saveOrUpdateMonthlyPlay(obj) {
  return post('/paymentMonthYear/create', obj)
}

// 删除
export function deleteMonthlyPlay(obj) {
  return post('/paymentMonthYear/delete', obj)
}

// 月度结算计划审批查看详情
export function detailMonthlyPlay(obj) {
  return get('/paymentMonthYear/get', obj)
}


// 审批id,status
export function setFlowStatus(query_obj) {
  return post('/paymentMonthYear/getStatus', query_obj)
}

// 获取设计变更code
export function getCode(obj) {
  return post('/paymentMonthYear/receiptsNo/get', obj)
}
