import { post, get } from '@/utils/cost/http'

export function searchAuditLogList(query_obj) {
  return get('/log/query', query_obj)
}

// 获取列表
export function getContractList(query_obj) {
  return get('/paymentcontract/list', query_obj)
}

// 保存或更新(新增)
export function saveOrUpdateContract(obj) {
  return post('/paymentcontract/createOrUpdate', obj)
}

// 删除
export function deleteContract(obj) {
  return post('/paymentcontract/delete', obj)
}

//GET /paymentcontract/get 获取合同结算详情
export function detailContract(obj) {
  return get('/paymentcontract/get', obj)
}

//  获取合同列表
export function getQueryContractList(query_obj) {
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

// 获取合同结算编号
export function getPaymentContractCode(query_obj) {
  return get('/paymentcontract/getPaymentContractCode', query_obj)
}
// 获取未转固变更签证信息getQueryContractList
export function getalterationIdList(query_obj) {
  return get('/paymentcontract/getalterationIdList', query_obj)
}

// 获取合同付款信息
export function getPaymentInfoList(query_obj) {
  return get('/contract/getPaymentInfo', query_obj)
}

// 根据合同编号获取奖罚情况
export function getApplyPaymentRewardPunishByContractCode(query_obj) {
  return post('/paymentcontract/getApplyPaymentRewardPunishByContractCode', query_obj)
}

// 选择变更签证/无合同费用
export function getIneffectiveAlteration(query_obj) {
  return get('/ineffectiveCost/getIneffectiveAlteration', query_obj)
}

// 获取的已审批并且造价通过的变更签证关联的合同信息
export function getContractListByAlterationStatus(query_obj) {
  return get('/contract/getContractListByAlterationStatus', query_obj)
}

// 审批id,status
export function setFlowStatus(query_obj) {
  return post('/paymentcontract/approve', query_obj)
}

// 成本拆分
export function dynacostSplittingList(query) {
  return post('/dynacost/splitting/memory/cp2sb2ct', query)
}

// 点击查看列表获取成本拆分
export function getDynacostSplit(query) {
  return get('/paymentcontract/getSplittingList', query)
}

// 根据合同编码获取合同详情
export function getDetailByContractCode(query) {
  return get('/contract/getDetailByContractCode', query)
}

