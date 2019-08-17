import {
  post,
  get
} from '@/utils/cost/http'

// 成本分期公共信息查询
export function searchCommonInfoList(accountObjectId) {
  return get('/accountObject/commonInfo', accountObjectId)
}

// 成本成本分期查询
export function searchAccountObjectList(projectId) {
  return get('/accountingObject/list', projectId)
}

// 项目信息{projectId:'',stageId:''}
export function getProjectInfo(query_obj) {
  return get('/project/projectInfo', query_obj)
}

// 项目地块信息parcelVersionId
export function getParcelInfo(parcelVersionId) {
  return get('/project/parcelInfo', parcelVersionId)
}

// 项目分期信息phaseVersionId
export function getPhaseInfo(phaseVersionId) {
  return get('/project/phaseInfo', phaseVersionId)
}

// 待同步分期业态列表
export function tobeSyncList(query_obj) {
  return get('/project/phaseBusinessType/tobeSyncList', query_obj)
}
// 项目已同步分期业态信息查询
export function getSyncList(query_obj) {
  return get('/project/phaseBusinessType/list', query_obj)
}
// 项目分期业态数据修改

export function updateSyncList(query_obj) {
  return post('/project/phaseBusinessType/update', query_obj)
}

// 成本分期新增

export function createAccountObject(query_obj) {
  return post('/accountingObject/create', query_obj)
}
// 成本分期更新
export function updateAccountObject(query_obj) {
  return post('/accountingObject/update', query_obj)
}
// 成本分期删除
export function deleteAccountObject(query_obj) {
  return post('/accountingObject/delete', query_obj)
}

// 项目同步主数据
export function saveSyncMds(query_obj) {
  return post('/project/phaseBusinessType/save', query_obj)
}

// 成本分期分期业态信息查询
export function getAccountingObject(query_obj) {
  return get('/accountingObject/phaseBusinessType/list', query_obj)
}

