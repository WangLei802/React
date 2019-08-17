// 合约规划编制接口
import {
  post,
  get,
  download
} from '@/utils/cost/http'

// 返回版本列表带分页
// companyId,
// accountingObjectId,
// stageId,
// status,
// pageNum,
// pageSize
export function getVersionlistAll(query_obj) {
  return get('/targetCostContractPlan/defineStageVersion/listAll', query_obj)
}

// 删除编制(可能是编制草稿/驳回  或 调整 草稿/驳回)
export function deleteTargetCostContractPlan(targetCostContractPlanId) {
  return post('/targetCostContractPlan/defineStageVersion/deleteTargetCostContractPlan', targetCostContractPlanId)
}

// 	保存或者更新合约规划
export function saveOrUpdateContractPlan(query_obj) {
  return post('/targetCostContractPlan/defineStageVersion/saveOrUpdateContractPlan', query_obj)
}

// 提交BPM审批
export function submitContractPlan(query_obj) {
  return post('/targetCostContractPlan/defineStageVersion/submitContractPlan', query_obj)
}

// 检查成本分期是否有合约规划编制 accounting_object_id
export function checkTargetCostVersion(query_obj) {
  return get('/targetCostContractPlan/defineStageVersion/loadTargetCostVersion', query_obj)
}

// 引入集团或者其他项目合约规划{type，accountingObjectId,currentAccountingObjectId}
export function importSubjectContractPlan(query_obj) {
  return get('/targetCostContractPlan/defineStageVersion/importSubjectContractPlan', query_obj)
}

// 导入
export function importData(obj) {
  return post('/targetCostContractPlan/defineStageVersion/export', obj)
}


// 其他项目合约规划成本分期列表companyId,projectId
export function getOtherProjectTemplate(query_obj) {
  return get('	/targetCostContractPlan/defineStageVersion/getOtherAccountingObjectTargetCostContractPlan', query_obj)
}


// 合约规划编制明细accountingObjectId,stageId,stageVersion
export function getContractPlanDetail(query_obj) {
  return get('/targetCostContractPlan/defineStageVersion/get', query_obj)
}



//===================合约规划变更=================
//调整合约规划
export function adjustTargetCostContractPlan(query_obj) {
  return post('/targetCostContractPlan/adjustStageVersion/saveOrUpdateContractPlan', query_obj)
}

//提交调整审批
export function submitTargetCostContractPlanAdjustment(query_obj) {
  return post('/targetCostContractPlan/adjustStageVersion/submitContractPlan', query_obj)
}

//检查是否可以调整accounting_object_id,stage_id
export function checkAdjustStageVersion(query_obj) {
  return get('/targetCostContractPlan/adjustStageVersion/checkAdjustStageVersion', query_obj)
}

//获取调整明细
export function getAdjustContractPlanDetail(query_obj) {
  return get('/targetCostContractPlan/adjustStageVersion/getTargetCostContractPlan', query_obj)
}

//====================总览=============================
export function getFullViewByAccountingObject(query_obj) {
  return get('/targetCostContractPlan/fullView/getFullViewByAccountingObject', query_obj)
}
// 目标成本查询 
// 查看某个合约规划编制详情,带数据accountingObjectId,stageId,stageVersion
export function getTargetCostContractPlanDetails(query_obj) {
  return get('/targetCostContractPlan/defineStageVersion/get', query_obj)
}

//获取合约规划目标成本编制的历史版本
export function getTargetCostContractPlanHistory(query_obj) {
  return get('/targetCostContractPlan/queryStageVersion/getTargetCostContractPlanHistory', query_obj)
}

//根据cost_target_cost_contract_plan_version表主键uuid获取当前合约规划目标成本
export function getTargetCostContractPlanById(query_obj) {
  return get('/targetCostContractPlan/queryStageVersion/getTargetCostContractPlanById', query_obj)
}

////合约规划多个版本对比
export function getTargetCostContractPlanVersionsByIds(query_obj) {
  return get('/targetCostContractPlan/queryStageVersion/getTargetCostContractPlanVersionsByIds', query_obj)
}


//查询核算信息(按科目)
export function getTargetCostContractPlanByAccountingObject(query_obj) {
  return get('/targetCostContractPlan/queryStageVersion/getTargetCostContractPlanDetailsGroupBySb', query_obj)
}

//查询核算信息(按合约)
export function getTargetCostContractPlanByContract(query_obj) {
  return get('/targetCostContractPlan/queryStageVersion/getTargetCostContractPlanDetailsGroupByCp', query_obj)
}


// 审批id,status
export function setFlowStatus(query_obj) {
  return post('/targetCostContractPlan/changeTargetCostContractPlanStatusTest', query_obj)
}

// 合约规划 成本分期明细{accountObjectId:""}
export function getAccountingObjectCommonInfo(query_obj) {
  return get('/accountingObject/commonInfo/tccp', query_obj)
}
