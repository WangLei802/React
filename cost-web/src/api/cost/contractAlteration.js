import { post, get } from '@/utils/cost/http'

export function searchAuditLogList(query_obj) {
  return get('/log/query', query_obj)
}

// 获取合同变更列表
export function getContractAlterationList(query_obj) {
  return get('/contractAlteration/list', query_obj)
}

//  获取合同变更详细
export function getContractAlterationDetail(designAlterationId) {
  return get('/contractAlteration/detail', designAlterationId)
}

//  新增合同变更
export function createContractAlterationDetail(query_obj) {
  return post('/contractAlteration/create', query_obj)
}

//  获取合同列表
export function getContractList(query_obj) {
  return post('/contract/queryContract', query_obj)
}

// 删除合同变更
export function deleteContractAlteration(obj) {
  return post('/contractAlteration/delete', obj)
}
// 获取合同变更编号
export function getCode(obj) {
  return post('/contractAlteration/getCode', obj)
}
// 更改状态
export function updateStatus(obj) {
  return post('/contractAlteration/status', obj)
}

// 提交审批
export function submit(obj) {
  return post('/contractAlteration/submit', obj)
}

// 成本拆分
export function dynacostSplittingList(query) {
  return post('/dynacost/splitting/memory/cp2sb2ct', query)
}
