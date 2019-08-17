import { post, get, download, post_param } from '@/utils/cost/http'

// 生成新合约  新添加接口
export function getNewPlanName(query) {
  return get('/contractPlan/getNewPlanName', query)
}

// 新增或更新合同
export function saveContractController(query) {
  return post('/contract/saveOrUpdate', query)
}

// 新增或更新合同
export function saveAdditionalRecordingCp(query) {
  return post('/contract/saveAdditionalRecordingCp', query)
}

// 删除合同
export function deleteContractController(queryId) {
  return post('/contract/delete', queryId)
}

// 基本信息发起合同审批流程之提交
export function commitContractController(queryId) {
  return post('/contract/submitBPMRequest', queryId)
}

// 合同列表
export function getContractList(query) {
  return get('/contract/getContractList', query)
}

// 合同编码
export function getContractCode(query) {
  return get('/contract/getContractCode', query)
}
// 获取主合同类表

export function getPrimaryContracts(query) {
  return get('/contract/getPrimaryContracts', query)
}

// 根据项目ID查询法人公司信息
export function getCompanylist(query) {
  return get('/project/fCompany/list', query)
}

// 根据核算对象ID查询法人公司信息
export function getAccountingCompanylist(query) {
  return get('/accountingObject/fCompany/list', query)
}

// 保存付款事项
export function saveContractPaymentItem(query) {
  return post('/contract/saveContractPaymentItem', query)
}

// 选择合约规划
export function getTargetCostContractPlan(query) {
  return get('/contract/getAvailableContractPlan', query)
}

// 新增或更新合同
export function saveOrUpdateContractController(query) {
  return post('/contract/saveOrUpdate', query)
}
// 发起合同审批流程
export function submitContractController(query) {
  return post('/contract/submitBPMRequest', query)
}

// 合同列表点击查看
export function getContractDetail(query) {
  return get('/contract/getContractDetail', query)
}

// 定标结果清单列表 费控合同信息 点击生成合同
export function getContractSourceBaseInfo(query) {
  return get('/contract/getContractSourceBaseInfo', query)
}

// 保存合同签订信息
export function saveSignInfo(query) {
  return post('/contract/saveSignInfo', query)
}

// 变更签证查看
export function getContractAlterationVisaInfo(query) {
  return post('/contract/getContractAlterationVisaInfo', query)
}

// 获取合同付款信息

export function getPaymentInfo(query) {
  return get('/contract/getPaymentInfo', query)
}

// 查询合同签订信息
export function getSignInfo(query) {
  return get('/contract/getSignInfo', query)
}

// 查看费控合同详情
export function getCostControl(query) {
  return get('/costControl/detail', query)
}

// 查看招采合同详情
export function getCostBidding(query) {
  return get('/costBidding/detail', query)
}

export function bpmAudit(query) {
  return post('/contract/bpmAudit', query)
}

// 点击乙方 丙方 弹出供应商数据
export function supplierInfo(query) {
  return get('/supplierInfo/list', query)
}

// 合作记录
export function partnerList(query) {
  return get('/contract/partnerList', query)
}

// 成本拆分
export function splittingList(query) {
  return post('/dynacost/splitting/memory/cp2sb', query)
}

// 成本拆分
export function dynacostSplittingList(query) {
  return post('/dynacost/splitting/memory/cp2sb2ct', query)
}

// 校验是否可以生成合同
export function checkContractPlanStatus(query) {
  return get('/costBidding/checkContractPlanStatus', query)
}

export function findCurrentUserOrgList(query) {
  return get('/contract/findCurrentUserOrgList', query)
}

export function findContractTypeCodeList(query) {
  return get('/contract/findContractTypeCodeList', query)
}

export function validIsVirtualCp(query) {
  return get('/contract/validIsVirtualCp', query)
}

export function findVirtualCpList(query) {
  return get('/contract/findVirtualCpList', query)
}

export function contractPlatformAccountTable(query) {
  return get('/contract/contractPlatformAccountTable', query)
}

export function contractPlatformAccountTableStatisticalData(query) {
  return get('/contract/contractPlatformAccountTableStatisticalData', query)
}

// 获取一级分类
export function getFirstCategory(query) {
  return get('/contractPlan/accObj/getFirstCategory', query)
}

// 获取二级分类
export function getSecondCategory(query) {
  return get('/contractPlan/accObj/getSecondCategory', query)
}

// 当前区域公司员工列表
export function findPageListByCurrentUserRegionalCompany(query) {
  return get('/permissionInfo/personInfo/list', query)
}

// 当前区域公司事业部列表
export function findAllDeptByCurrentUserRegionalCompany(query) {
  return get('/permissionInfo/dept/list', query)
}

// 释放预留变更金额
export function getReleaseReservedAmount(query) {
  return post('/contract/releaseReservedAmount', query)
}

// export function getReleaseReservedAmount(contractId) {
// return post_param(
//   '/contract/releaseReservedAmount', contractId)
// }

// export function getReleaseReservedAmount(contractId) {
// let param = {
//   contractId:contractId
// }
// return post_param('/contract/releaseReservedAmount', param)
// }
export function signSubmit(query) {
  return post('/contract/signSubmit', query)
}

// 根据合同编码获取合同详情
export function getDetailByContractCode(query) {
  return get('/contract/getDetailByContractCode', query)
}

contractPlatformAccountTableStatisticalData
