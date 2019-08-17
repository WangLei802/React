import {
  post,
  get,
  download
} from '@/utils/cost/http'

// 获取标准或者项目下的科目集合
export function getSubjectTree(type) {
  return get('/subjectContractPlanMapping/listAll', type)
}

//	获取某一个科目下的合约规划
export function getSubjectContractPlanMappingListBySubjectId(subjectId) {
  return get('/subjectContractPlanMapping/ContractPlan/listAll', subjectId)
}

//	保存或更新末级科目节点下的合约规划
export function saveOrUpdateSubjectContractPlanMapping(ContractPlanModel) {
  return post('/subjectContractPlanMapping/save', ContractPlanModel)
}

// 根据合约规划模板id，物理删除记录
export function deleteSubjectContractPlanMapping(model) {
  return post('/subjectContractPlanMapping/delete', model)
}

// 根据合约规划模板id，更改状态
export function changeSubjectContractPlanMappingStatus(model) {
  return post('/subjectContractPlanMapping/changeStatus', model)
}

// 获取合约规划树
export function listAllContractPlanTree(query_obj) {
  return get('/contractPlan/listAll', query_obj)
}

// 获取合约规划树（未锁定）
export function listAllExcludeLocked(query_obj) {
  return get('/contractPlan/listAllExcludeLocked', query_obj)
}
