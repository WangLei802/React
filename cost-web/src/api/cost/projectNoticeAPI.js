import { post, get } from '@/utils/cost/http'

export function searchAuditLogList(query_obj) {
  return get('/log/query', query_obj)
}

// 获取列表
export function getProjectNoticeList(query_obj) {
  return get('/paymentEngineering/list', query_obj)
}

// 保存或更新(新增)
export function saveOrUpdateProjectNotice(obj) {
  return post('/paymentEngineering/create', obj)
}

// 删除
export function deleteProjectNotice(obj) {
  return post('/paymentEngineering/delete', obj)
}

//工程结算通知审批查看详情
export function detailPaymentEngineering(obj) {
  return get('/paymentEngineering/get', obj)
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
  return post('/paymentEngineering/getStatus', query_obj)
}

export function getProjectNumber(obj) {
  return post('/paymentEngineering/receiptsNo/get', obj)
}
