import { post, get } from '@/utils/cost/http'

export function searchAuditLogList(query_obj) {
  return get('/log/query', query_obj)
}

//  获取无合同费用申请
export function getApplyPaymentNoContract(designAlterationId) {
  return get('/applyPaymentNoContract/get', designAlterationId)
}

//  获取代垫代扣费用申请
export function getApplyPaymentPad(obj) {
  return post('/applyPaymentPad/get', obj)
}

//  获取代垫代扣费用编号
export function getApplyPaymentPadCode(obj) {
  return post('/applyPaymentPad/getCode', obj)
}

//  新增无合同费用申请
export function createApplyPaymentNoContract(query_obj) {
  return post('/applyPaymentNoContract/create', query_obj)
}

//  新增无合同费用申请新合约规划
export function createApplyPaymentNoContractCp(query_obj) {
  return post('/applyPaymentNoContract/createNewCp', query_obj)
}

//  提交无合同费用申请
export function submitApplyPaymentNoContract(query_obj) {
  return post('/applyPaymentNoContract/submit', query_obj)
}

//  提交无合同费用申请
export function submitApplyPaymentPad(query_obj) {
  return post('/applyPaymentPad/submit', query_obj)
}

//  修改状态
export function updateStatus(query_obj) {
  return post('/applyPaymentNoContract/updateStatus', query_obj)
}

//  新增代垫代扣费用申请
export function createApplyPaymentPad(query_obj) {
  return post('/applyPaymentPad/create', query_obj)
}

//  获取无合同费用申请列表
export function getApplyPaymentNoContractList(query_obj) {
  return post('/applyPaymentNoContract/list', query_obj)
}

// 删除无合同费用申请
export function deleteApplyPaymentNoContract(obj) {
  return post('/applyPaymentNoContract/delete', obj)
}

// 删除代垫代扣费用申请
export function deleteApplyPaymentPad(obj) {
  return post('/applyPaymentPad/delete', obj)
}

// 获取无合同费用申请编号
export function getCode(obj) {
  return post('/applyPaymentNoContract/getCode', obj)
}

// 实付信息列表
export function getActualPaymentList(obj) {
  return post('/actualPayment/list', obj)
}

// 实付信息详细
export function getActualPaymentDetail(obj) {
  return get('/actualPayment/get', obj)
}
// 成本拆分
export function dynacostSplittingList(query) {
  return post('/dynacost/splitting/memory/cp2sb2ct', query)
}

export function NoZfinancialSubmit(obj) {
  return post('/applyPaymentNoContract/zfinancialSubmit', obj)
}
export function PadZfinancialSubmit(obj) {
  return post('/applyPaymentPad/zfinancialSubmit', obj)
}
