import {
  post,
  get
} from '@/utils/cost/http'

// 获取目标成本调整列表
export function listAllTargetCostAdjustment(query_obj) {
  return get('/targetCost/fixStageVersion/listAll', query_obj)
}

// 获取目标成本调整明细
export function getTargetCostAdjustmentDetail(query_obj) {
  return get('/targetCost/getStandaredSubjectList', query_obj)
}

// 创建目标成本调整
export function createTargetCostAdjustment(query_obj) {
  return post('/targetCost/fixStageVersion/save', query_obj)
}

// 更新目标成本调整
export function updateTargetCostAdjustment(query_obj) {
  return post('/targetCost/fixStageVersion/save', query_obj)
}

//	删除目标成本调整
export function deleteTargetCostAdjustment(TargetCostCompilationModel) {
  return post('/targetCost/defineStageVersion/delete', TargetCostCompilationModel)
}

// 保存阶段版本的草稿
export function saveDraftVersion(query_obj) {
  return post('/targetCost/defineStageVersion/save', query_obj)
}

// 提交版本审批
export function submitStageVersionRequest(query_obj) {
  return post('	/targetCost/defineStageVersion/submit', query_obj)
}

// 获取目标成本调整版本列表
export function getTargetCostFixVersionList(query_obj) {
  return get('/targetCost/getTargetCostFixVersiontList', query_obj)
}

// 获取该成本分期下目标成本列表带项目科目
export function getFixTargetCostModel(query_obj) {
  //return get('/targetCost/getFixAccountingSubjectList', query_obj)
  return get('/targetCost/defineStageVersion/get', query_obj)
}


// 检查是否可以调整
export function checkTargetCostFixVersion(query_obj) {
  return get('/targetCost/fixStageVersion/checkTargetCostFixVersion', query_obj)
}

// 获取调整明细
export function getAdjustFixTargetCostModel(query_obj) {
  return get('/targetCost/defineStageVersion/getFix', query_obj)
}
