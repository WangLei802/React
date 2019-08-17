import { get, post } from '@/utils/cost/http'

// 合同申请列表
export function applyPaymentList(body) {
  return get('/applyPaymentContract/list', body)
}
// 保存付款申请
export function saveApplyPayment(body) {
  return post('/applyPaymentContract/create', body)
}
// 更新付款申请
export function updateApplyPayment(body) {
  return post('/applyPaymentContract/update', body)
}
// 付款申请详情
export function getApplyPaymentDetail(body) {
  return get('/applyPaymentContract/get', body)
}
// 根据合同编号获取合同相关信息
export function findByContractCode(body) {
  return get('/applyPaymentContract/findByContractCode', body)
}
// 删除合同
export function deleteApplyPaymentContract(body) {
  return post('/applyPaymentContract/delete', body)
}
// 获取付款申请编码
export function getApplyPaymentCode(body) {
  return get('/applyPaymentContract/getApplyPaymentCode', body)
}
// 更新状态
export function updateApplyPaymentStatus(body) {
  return post('/applyPaymentContract/updateStatus', body)
}
// 更新状态
export function submitApplyPayment(body) {
  return post('/applyPaymentContract/submit', body)
}
export function getSupplierBankInfo(body) {
  return get('/supplierInfo/getAccountInfoBySupplierId', body)
}
// 获取供应商银行信息
export function getBankInfo(body) {
  return get('/supplierInfo/getBankInfo', body)
}
// 获取供应商银行分页信息
export function getBankPageInfo(body) {
  return get('/supplierInfo/getBankPageInfo', body)
}
// 根据银行档案id获取供应商银行信息
export function getBankInfoByBankdocId(body) {
    return get('/supplierInfo/getBankInfoByBankdocId', body)
}
// 获取银行帐号信息
export function getAccountInfo(body) {
  return get('/supplierInfo/getAccountInfo', body)
}

export function paymentContractPlatformAccountTable(body) {
  return get('/applyPaymentContract/paymentContractPlatformAccountTable', body)
}
export function paymentContractPlatformAccountTableStatisticalData(body) {
  return get('/applyPaymentContract/paymentContractPlatformAccountTableStatisticalData', body)
}
export function additionalRecordingActualPayment(body) {
  return post('/applyPaymentContract/additionalRecordingActualPayment', body)
}
export function additionalRecordingActualNoPayment(body) {
  return post('/applyPaymentNoContract/additionalRecordingActualPayment', body)
}

export function zfinancialSubmit(body) {
  return post('/applyPaymentContract/zfinancialSubmit', body)
}
export function billPrinting(body) {
  return get('/paymentCg/billPrinting', body)
}

// 已付金额明细
export function getApplyPaymentPadDetail(body) {
  return get('/applyPaymentPad/getApplyPaymentPadDetail', body)
}