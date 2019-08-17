import { post, get } from '@/utils/cost/http'

export function searchAuditLogList(query_obj) {
  return get('/log/query', query_obj)
}

// 获取列表
export function getCostConfirmListShare(query_obj) {
  return get('/confirmshare/list', query_obj)
}

// 获取详情
export function getCostConfirmDetailShare(query_obj) {
  return get('/confirmshare/get', query_obj)
}

// 跟投成本确认获取
export function getShareDetail(query_obj) {
  return post('/confirmshare/shareDetail/get', query_obj)
}

// 保存或更新(新增)
export function saveOrUpdateCostConfirmShare(obj) {
  return post('/confirmshare/create', obj)
}

// 删除
export function deleteCostConfirmShare(obj) {
  return post('/confirmshare/delete', obj)
}

// 获取法人列表
export function getCompanylist(obj) {
  return post('/project/fCompany/list', obj)
}

// 获取单据编号
export function getReceiptsNo(obj) {
  return post('/confirmshare/receiptsNo/get', obj)
}
// 审批id,status
export function setFlowStatus(query_obj) {
  return post('/confirmshare/getStatus', query_obj)
}
