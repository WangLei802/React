import { post, get } from '@/utils/cost/http'

export function searchAuditLogList(query_obj) {
  return get('/log/query', query_obj)
}

// 获取列表
export function getBidBondList(query_obj) {
  return get('/paymentcashdeposit/list', query_obj)
}

// 保存或更新(新增)
export function saveOrUpdateBidBond(obj) {
  return post('/paymentcashdeposit/createOrUpdate', obj)
}

// 删除
export function deleteBidBond(obj) {
  return post('/paymentcashdeposit/delete', obj)
}

// 获取银行帐号信息
export function getAccountInfo(body) {
  return get('/supplierInfo/getAccountInfo', body)
}


// 获取履约保证金详情
export function detailBidBond(obj) {
  return get('/paymentcashdeposit/get', obj)
}

//获取法人列表
export function getCompanylist(obj) {
  return post('/project/fCompany/list', obj)
}

// 审批id,status
export function setFlowStatus(query_obj) {
  return post('/paymentcashdeposit/approve', query_obj)
}

// 获取审批单编号
export function getPaymentCashDepositCode(query_obj) {
  return get('/paymentcashdeposit/getPaymentCashDepositCode', query_obj)
}

//关联流程列表
export function getmystartforfkList(query_obj) {
  return get('/getmystartforfk/list', query_obj)
}

//查询关联流程表格
export function associationprocess(query_obj) {
  return get('/associationprocess/list', query_obj)
}

export function zfinancialSubmit(query_obj) {
  return post('/paymentcashdeposit/zfinancialSubmit', query_obj)
}