import { post, get } from '@/utils/cost/http'

export function searchAuditLogList(query_obj) {
  return get('/log/query', query_obj)
}

// 获取列表
export function getConstructionCostList(query_obj) {
  return get('/budgetqualityprice/list', query_obj)
}

// 保存或更新(新增)
export function saveOrUpdateConstructionCost(obj) {
  return post('/budgetqualityprice/createOrUpdate', obj)
}

// 删除
export function deleteConstructionCost(obj) {
  return post('/budgetqualityprice/delete', obj)
}

///获取认质认价详情budgetqualityprice/get
export function detailConstructionCost(obj) {
  return get('/budgetqualityprice/get', obj)
}

//  获取合同列表
export function getContractList(query_obj) {
  return post('/contract/queryContract', query_obj)
}
//  获取合同详情
export function getContractDetail(query_obj) {
  return get('/budgetqualityprice/approve', query_obj)
}

// 变更签证信息
export function getVisaList(query_obj) {
  return get('/budgetconveysure/getalterationIdList', query_obj)
}

// 审批id,status
export function setFlowStatus(query_obj) {
  return post('/budgetqualityprice/approve', query_obj)
}
