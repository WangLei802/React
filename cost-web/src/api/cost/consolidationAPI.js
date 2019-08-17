import { post, get } from '@/utils/cost/http'

export function searchAuditLogList(query_obj) {
  return get('/log/query', query_obj)
}

// 获取列表
export function getConsolidationList(query_obj) {
  return get('/budgetconveysure/list', query_obj)
}

// 保存或更新(新增)
export function saveOrUpdateConsolidation(obj) {
  return post('/budgetconveysure/create', obj)
}

// 删除
export function deleteConsolidation(obj) {
  return post('/budgetconveysure/delete', obj)
}

//  获取合同列表
export function getContractList(query_obj) {
  return post('/contract/queryContract', query_obj)
}

///获取转固详情  budgetconveysure/get
export function detailBudgetconveysure(query_obj) {
  return get('/budgetconveysure/get', query_obj)
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
  return post('/budgetconveysure/approve', query_obj)
}

// 成本拆分
export function dynacostSplittingList(query) {
  return post('/dynacost/splitting/memory/cp2sb2ct', query)
}

// 点击查看列表获取成本拆分
export function getDynacostSplit(query) {
  return get('/budgetconveysure/getSplittingList', query)
}

