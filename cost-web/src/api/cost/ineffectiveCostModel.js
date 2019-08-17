import { post, get } from '@/utils/cost/http'

export function searchAuditLogList(query_obj) {
  return get('/log/query', query_obj)
}

// 获取无效成本列表
export function getIneffectiveList(query_obj) {
  return get('/ineffectiveCost/list', query_obj)
}

// 保存或更新无效成本
export function saveOrUpdateIneffectiveCost(obj) {
  return post('/ineffectiveCost/saveOrUpdate', obj)
}

// 删除无效成本
export function deleteIneffective(obj) {
  return post('/ineffectiveCost/delete', obj)
}

//获取无效成本详情
export function detailIneffectiveCost(obj) {
  return get('/ineffectiveCost/get', obj)
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
//获取未转固变更签证信息getQueryContractList
export function getalterationIdList(query_obj) {
  return get('/paymentcontract/getalterationIdList', query_obj)
}

//获取合同付款信息
export function getPaymentInfoList(query_obj) {
  return get('/contract/getPaymentInfo', query_obj)
}

//根据合同编号获取奖罚情况
export function getApplyPaymentRewardPunishByContractCode(query_obj) {
  return post('/paymentcontract/getApplyPaymentRewardPunishByContractCode', query_obj)
}

//选择变更签证/无合同费用
export function getIneffectiveAlteration(query_obj) {
  return get('/ineffectiveCost/getIneffectiveAlteration', query_obj)
}

//获取的已审批并且造价通过的变更签证关联的合同信息
export function getContractListByAlterationStatus(query_obj) {
  return get('/contract/getContractListByAlterationStatus', query_obj)
}

// 审批id,status
export function setFlowStatus(query_obj) {
  return post('/ineffectiveCost/approve', query_obj)
}

export function getIneffectiveCostCode(query_obj) {
  return get('/ineffectiveCost/getIneffectiveCostCode', query_obj)
}
