import { post, get } from '@/utils/cost/http'

export function searchAuditLogList(query_obj) {
  return get('/log/query', query_obj)
}

// 获取列表
export function getGuaranteeList(query_obj) {
  return get('/paymentqualityguarantee/list', query_obj)
}

// 保存或更新(新增)
export function saveOrUpdateGuarantee(obj) {
  return post('/paymentqualityguarantee/createOrUpdate', obj)
}

// 删除
export function deleteGuarantee(obj) {
  return post('/paymentqualityguarantee/delete', obj)
}

//  获取合同列表
export function getContractList(query_obj) {
  return post('/contract/queryContract', query_obj)
}
//  获取合同详情
export function getContractDetail(query_obj) {
  return get('/contract/getContractDetail', query_obj)
}

// 变更签证信息
export function getVisaList(query_obj) {
  return get('/budgetconveysure/getalterationIdList', query_obj)
}

// 获取水电费
export function getByContractCodeList(query_obj) {
  return get('/applyPaymentPad/getByContractCode', query_obj)
}

// 审批id,status
export function setFlowStatus(query_obj) {
  return post('/paymentqualityguarantee/approve', query_obj)
}
// 获取质保金编号
export function getPaymentQualityGuaranteeCode(query_obj) {
  return get('/paymentqualityguarantee/getPaymentQualityGuaranteeCode', query_obj)
}

