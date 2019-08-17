import { post, get } from '@/utils/cost/http'

export function searchAuditLogList(query_obj) {
  return get('/log/query', query_obj)
}

// 获取列表
export function getKeepCostConfirmList(query_obj) {
  return get('/confirmthrow/list', query_obj)
}

// 获取详情
export function getKeepCostConfirmDetail(query_obj) {
  return get('/confirmthrow/get', query_obj)
}

// 跟投成本确认获取
export function getThrowDetail(query_obj) {
  return post('/confirmthrow/throwDetail/get', query_obj)
}

// 保存或更新(新增)
export function saveOrUpdateKeepCostConfirm(obj) {
  return post('/confirmthrow/create', obj)
}

// 删除
export function deleteKeepCostConfirm(obj) {
  return post('/confirmthrow/delete', obj)
}

// 获取法人列表
export function getCompanylist(obj) {
  return post('/project/fCompany/list', obj)
}

// 获取单据编号
export function getReceiptsNoData(obj) {
  return post('/confirmthrow/receiptsNo/get', obj)
}

// 审批id,status
export function setFlowStatus(query_obj) {
  return post('/confirmthrow/getStatus', query_obj)
}
