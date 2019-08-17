import {
  post,
  get
} from '@/utils/cost/http'

export function searchAuditLogList(query_obj) {
  return get('/log/query', query_obj)
}

// 获取拆分列表
export function getSplittingList(query_obj) {
  return get('/dynacost/splitting/manage/recordList', query_obj)
}

export function getSplittingAdjust(query_obj) {
  return get('/dynacost/splitting/manage/adjust', query_obj)
}

export function saveSplittingAdjust(query_obj) {
  return post('/dynacost/splitting/manage/save', query_obj)
}

// 动态成本查询
export function getDynacost(query_obj) {
  return get('/dynacost/cp/latest', query_obj)
}

export function getSbDynacost(query_obj) {
  return get('/dynacost/sb/latest', query_obj)
}

// 查看合约历史快照
export function getlistHistory(query_obj) {
  return get('/dynacosthistory/cphistory/listHistory', query_obj)
}

// 手动快照
export function getTotalhistory(query_obj) {
  return get('/dynacosthistory/totalhistory/handSnapshot', query_obj)
}

// 科目查看合约历史快照
export function getSbHistory(query_obj) {
  return get('/dynacosthistory/sbhistory/listHistory', query_obj)
}

// 动态成本年度汇总表
export function getAnnual(query_obj) {
  return get('/dynacost/report/annual', query_obj)
}


// 动态成本明细表-按合约
export function getReportDetailContractPlan(query_obj) {
  return get('/dynacost/report/detailContractPlan', query_obj)
}
// 动态成本明细表-按科目
export function getReportDetailSubject(query_obj) {
  return get('/dynacost/report/detailSubject', query_obj)
}
