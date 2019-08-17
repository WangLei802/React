import {
  get,post
} from '@/utils/cost/http'

// 成本分期树
export function getAccountingTargetTree(companyId) {
  return get('/accountingObject/tree', companyId)
}

// 项目树
export function getProjectTargetTree(companyId) {
  return get('/project/tree', companyId)
}

// 项目成本分期树(五级，集团、公司、部门、项目、成本分期)
export function getProjectAccountingTargetTree(companyId) {
  return get('/accountingObject/projectTree', companyId)
}

// 目标成本总览{companyId,projectId}
export function getFullViewByAccountingObject(query_obj) {
  return get('/targetCost/fullView/getFullViewByAccountingObject', query_obj)
}

//法人公司
export function getCompanylist(obj) {
  return get('/project/fCompany/list', obj)
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