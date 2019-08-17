import { post, get } from '@/utils/cost/http'

export function searchAuditLogList(query_obj) {
  return get('/log/query', query_obj)
}

// 获取列表
export function getDiameterList(query_obj) {
  return get('/budgetCaliber/list', query_obj)
}

// 保存或更新(新增)
export function saveOrUpdateDiameter(obj) {
  return post('/budgetCaliber/create', obj)
}
// 获取详情
export function getDesignAlterationDetail(obj) {
  return post('/budgetCaliber/get', obj)
}

// 删除
export function deleteDiameter(obj) {
  return post('/budgetCaliber/delete', obj)
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

// 审批id,status
export function setFlowStatus(query_obj) {
  return post('/budgetCaliber/getStatus', query_obj)
}
