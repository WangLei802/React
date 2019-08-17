import { post, get } from '@/utils/cost/http'

export function searchAuditLogList(query_obj) {
  return get('/log/query', query_obj)
}

// 获取设计变更列表
export function getDesignAlterationList(query_obj) {
  return get('/siteVisa/list', query_obj)
}

// 指令单状态变更
export function updateAlterationStatus(query_obj) {
  return post('/siteVisa/instruction/status/update', query_obj)
}

// 指令单完工确认
export function confirmDesignAlterationInstruction(query_obj) {
  return post('/siteVisa/instruction/completionConfirm', query_obj)
}

// 指令单造价确认
export function costConfirmDesignAlterationInstruction(query_obj) {
  return post('/siteVisa/instruction/costConfirm', query_obj)
}
// 指令单详细
export function getDesignAlterationInstructionDetail(query_obj) {
  return get('/siteVisa/instruction/detail', query_obj)
}

// 根据设计变更id获取指令单列表
export function getByAlterationId(query_obj) {
  return get('/siteVisa/instruction/getByAlterationId', query_obj)
}

// 获取指令单列表
export function getDesignAlterationInstructionList(query_obj) {
  return get('/siteVisa/instruction/list', query_obj)
}

//  获取设计变更详细
export function getDesignAlterationDetail(designAlterationId) {
  return get('/siteVisa/detail', designAlterationId)
}

//  新增设计变更
export function createDesignAlterationDetail(query_obj) {
  return post('/siteVisa/create', query_obj)
}

//  获取合同列表
export function getContractList(query_obj) {
  return post('/contract/queryContract', query_obj)
}

// 删除设计变更
export function deleteDesignAlteration(obj) {
  return post('/siteVisa/delete', obj)
}

// 修改审批状态
export function updateDalStatus(obj) {
  return post('/siteVisa/status', obj)
}

// 获取设计变更code
export function getCode(obj) {
  return post('/siteVisa/getCode', obj)
}

// 提交审批
export function submit(obj) {
  return post('/siteVisa/submit', obj)
}

// 造价确认提交审批
export function submitCost(obj) {
  return post('/siteVisa/submit/cost', obj)
}

// 造价二次确认提交审批
export function submitCostRetry(obj) {
  return post('/siteVisa/submit/cost/retry', obj)
}

// 修改指令单状态
export function updateInstructionStatus(obj) {
  return post('/siteVisa/instruction/status', obj)
}

//  生成指令单
export function createDesignAlterationInstruction(query_obj) {
  return post('/siteVisa/instruction/create', query_obj)
}

// 成本拆分
export function dynacostSplittingList(query) {
  return post('/dynacost/splitting/memory/cp2sb2ct', query)
}
