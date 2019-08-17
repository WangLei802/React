import { post, get } from '@/utils/cost/http'

export function searchAuditLogList(query_obj) {
  return get('/log/query', query_obj)
}

// 获取设计变更列表
export function getDesignAlterationList(query_obj) {
  return get('/designAlteration/list', query_obj)
}

// 指令单状态变更
export function updateAlterationStatus(query_obj) {
  return post('/designAlteration/instruction/status/update', query_obj)
}

// 指令单完工确认
export function confirmDesignAlterationInstruction(query_obj) {
  return post('/designAlteration/instruction/completionConfirm', query_obj)
}

// 指令单造价确认
export function costConfirmDesignAlterationInstruction(query_obj) {
  return post('/designAlteration/instruction/costConfirm', query_obj)
}
// 指令单详细
export function getDesignAlterationInstructionDetail(query_obj) {
  return get('/designAlteration/instruction/detail', query_obj)
}

// 根据设计变更id获取指令单列表
export function getByAlterationId(query_obj) {
  return get('/designAlteration/instruction/getByAlterationId', query_obj)
}

// 获取指令单列表
export function getDesignAlterationInstructionList(query_obj) {
  return get('/designAlteration/instruction/list', query_obj)
}

//  获取设计变更详细
export function getDesignAlterationDetail(designAlterationId) {
  return get('/designAlteration/detail', designAlterationId)
}

//  新增设计变更
export function createDesignAlterationDetail(query_obj) {
  return post('/designAlteration/create', query_obj)
}

//  生成指令单
export function createDesignAlterationInstruction(query_obj) {
  return post('/designAlteration/instruction/create', query_obj)
}

//  获取合同列表
export function getContractList(query_obj) {
  return post('/contract/queryContract', query_obj)
}

// 删除设计变更
export function deleteDesignAlteration(obj) {
  return post('/designAlteration/delete', obj)
}

// 修改设计变更状态
export function updateDalStatus(obj) {
  return post('/designAlteration/status', obj)
}

// 修改指令单状态
export function updateInstructionStatus(obj) {
  return post('/designAlteration/instruction/status', obj)
}
// 获取设计变更code
export function getCode(obj) {
  return post('/designAlteration/getCode', obj)
}

// 提交审批
export function submit(obj) {
  return post('/designAlteration/submit', obj)
}

// 造价确认提交审批
export function submitCost(obj) {
  return post('/designAlteration/submit/cost', obj)
}
// 造价二次确认提交审批
export function submitCostRetry(obj) {
  return post('/designAlteration/submit/cost/retry', obj)
}

// 成本拆分
export function dynacostSplittingList(query) {
  return post('/dynacost/splitting/memory/cp2sb2ct', query)
}

// 变更签证台账表getTable
export function getDesignAlterationTable(query) {
  return post('/designAlteration/getTable', query)
}

// 变更签证台账表getTable
export function getDesignAlterationTableByContractCode(query) {
  return post('/designAlteration/getTableByContractCode', query)
}

// 变更签证台账表getTableTotal
export function getDesignAlterationTableTotal(query) {
  return post('/designAlteration/getTableTotal', query)
}
// 变更签证台账表getTableTotal
export function getDesignAlterationTableContractTotal(query) {
  return post('/designAlteration/getTableContractTotal', query)
}

