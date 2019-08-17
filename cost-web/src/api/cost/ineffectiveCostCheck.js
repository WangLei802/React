import { post, get } from '@/utils/cost/http'

export function searchAuditLogList(query_obj) {
  return get('/log/query', query_obj)
}

// 获取无效成本列表
export function getIneffectiveList(query_obj) {
  return get('/ineffectiveCost/IneffectiveCostLedgerList', query_obj)
}

// 导出无效成本台账excel
export function exportInvalidCostAccountDat(obj) {
  return get('/ineffectiveCost/exportInvalidCostAccountDat', obj)
}

// 获取无效成本台账汇总列表
export function getIneffectiveSummaryList(obj) {
  return get('/ineffectiveCost/getTable', obj)
}

