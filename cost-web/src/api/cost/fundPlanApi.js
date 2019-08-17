import { post, get } from '@/utils/cost/http'

export function searchAuditLogList(query_obj) {
  return get('/log/query', query_obj)
}

// 获取列表
export function getFundPlanList(query_obj) {
  return get('/fundsPeriod/hierarchyList', query_obj)
}

// 保存或更新(新增)
export function saveOrUpdateFundPlan(obj) {
  return post('/fundsPeriod/create', obj)
}

// 删除
export function deleteFundPlan(obj) {
  return post('/fundsPeriod/delete', obj)
}

// 查看全周期资金计划历史版本
export function fundsPeriodVersion(obj) {
  return get('/fundsPeriod/fundsPeriodVersion', obj)
}

// 根据开始时间与结束时间返回季度
export function getQuarter(obj) {
  return get('/fundsPeriod/getQuarter', obj)
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
// export function setFlowStatus(query_obj) {
//   return post('/budgetqualityprice/approve', query_obj)
// }

export function setFlowStatus(query_obj) {
  return post('/fundsPeriod/getStatus', query_obj)
}

// 查看详情
export function getFunPlanDetail(query_obj) {
  return get('/fundsPeriod/get', query_obj)
}

// 查看是否可以全周期资金计划自审批
//fundsPeriod/getVerification
export function getVerification(query_obj) {
  return post('/fundsPeriod/getVerification', query_obj)
}
