import {
  post,
  get
} from '@/utils/cost/http'
// ========================== list =======================================
// 检查目标成本编制accountingObjectId,stageId
export function checkTargetCostVersion(query_obj) {
  return get('/targetCost/defineStageVersion/checkTargetCostVersion', query_obj)
}

// 获取目标成本编制
export function listAllTargetCostCompilation(query_obj) {
  return get('/targetCost/getTargetCostVersiontList', query_obj)
}

// 创建目标成本编制
export function createTargetCostCompilation(query_obj) {
  return post('/targetCostCompilation/create', query_obj)
}

// 更新目标成本编制
export function updateTargetCostCompilation(query_obj) {
  return post('/targetCostCompilation/update', query_obj)
}

//	删除目标成本编制
export function deleteTargetCostCompilation(TargetCostCompilationModel) {
  return post('/targetCost/defineStageVersion/delete', TargetCostCompilationModel)
}

// ========================== edit =======================================
// 目标成本编制
export function getStandaredSubjectList(query_obj) {
  return get('/targetCost/getStandaredSubjectList', query_obj)
}

// 获取成本分期的目标成本编制信息(属性+分期+科目成本明细)
export function getTargetCostcompilationDetail(query_obj) {
  return get('/targetCost/defineStageVersion/get', query_obj)
}

// 获取其他成本分期科目模板
export function getAccountingSubjectList(query_obj) {
  return get('/targetCost/getAccountingSubjectList', query_obj)
}

// 保存阶段版本的草稿
export function saveDraftVersion(query_obj) {
  return post('/targetCost/defineStageVersion/saveOrUpdate', query_obj)
}

// 更新阶段版本的草稿
export function updateDraftVersion(query_obj) {
  return post('/targetCost/defineStageVersion/saveOrUpdate', query_obj)
}

// 提交版本审批
export function submitStageVersionRequest(query_obj) {
  return post('/targetCost/defineStageVersion/submit', query_obj)
}

// 目标成本编制 导入
export function importData(obj) {
  return post('/targetCost/defineStageVersion/import', obj)
}

// 目标成本编制 导出
export function exportData(obj) {
  return post('/targetCost/defineStageVersion/export', obj)
}

// ========================== eidt 其他项目模板 =======================================
// 获取其他项目模板
export function getOtherProjectTemplate(query_obj) {
  return get('/targetCost/queryAccountingSubjectList', query_obj)
}

// 目标从成本编制列表
export function getTargetCosVersiontList(query_obj) {
  return get('/targetCost/getTargetCosVersiontList', query_obj)
}

// 审批id,status
export function setFlowStatus(query_obj) {
  return post('/targetCost/changeTargetCostStatusTest', query_obj)
}

//目标成本汇总表
export function getTCSummaryReport(query_obj) {
  return get('/targetCost//queryTargetCostReport', query_obj)
}
