import {
  post,
  get
} from '@/utils/cost/http'

export function searchAuditLogList(query_obj) {
  return get('/log/query', query_obj)
}

// 获取合约规划树
export function listAllContractPlanTree(query_obj) {
  return get('/contractPlan/listAll', query_obj)
}

// 创建
export function createContractPlan(query_obj) {
  return post('/contractPlan/create', query_obj)
}

// 更新
export function updateContractPlan(query_obj) {
  return post('/contractPlan/update', query_obj)
}

//	删除合约规划
export function deleteContractPlan(ContractPlanModel) {
  return post('/contractPlan/delete', ContractPlanModel)
}

//	更改合约规划节点状态
export function updateStatus(query_obj) {
  return post('/contractPlan/status/update', query_obj)
}
