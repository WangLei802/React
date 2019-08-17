import { post, get } from '@/utils/cost/http'

export function searchAuditLogList(query_obj) {
  return get('/log/query', query_obj)
}

// 获取列表
export function getProjectDataApproveList(query_obj) {
  return get('/paymentProject/list', query_obj)
}

// 保存或更新(新增)
export function saveOrUpdateProjectDataApprove(obj) {
  return post('/paymentProject/create', obj)
}

// 删除
export function deleteProjectDataApprove(obj) {
  return post('/paymentProject/delete', obj)
}

// 项目结算资料审批查看详情
export function detailProjectDataApprove(obj) {
  return get('/paymentProject/get', obj)
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
  return post('/paymentProject/getStatus', query_obj)
}

export function getProjectNumber(obj) {
  return post('/paymentProject/receiptsNo/get', obj)
}
