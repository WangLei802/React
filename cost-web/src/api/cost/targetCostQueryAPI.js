import {
  post,
  get
} from '@/utils/cost/http'

// 查询成本分期当前版本目标成本编制
export function getTargetCostByAccountingObject(query_obj) {
  return get('/targetCost/queryStageVersion/targetCostByAccountingObject', query_obj)
}

// 导出当前成本分期目标成本编制

// 获取成本分期目标编制历史版本
export function getTargetCostHistory(query_obj) {
  return get('/targetCost/queryStageVersion/targetCostHistory', query_obj)
}

// 根据version表uuid获取当前成本分期目标成本
export function getTargetCostByVersionUUID(query_obj) {
  return get('/targetCost/queryStageVersion/getTargetCostByVersionUUID', query_obj)
}

//目标成本多个版本对比ids 多个id以逗号“,”分隔
export function getTargetCostVersionsByIds(query_obj) {
  return get('/targetCost/queryStageVersion/getTargetCostVersionsByIds', query_obj)
}

// 成本分期明细{accountObjectId:""}
export function getAccountingObjectCommonInfo(query_obj) {
  return get('/accountingObject/commonInfo', query_obj)
}

// 项目成本分期树
export function getAccountingObjectProjectTree() {
  return get('/accountingObject/projectTree')
}
