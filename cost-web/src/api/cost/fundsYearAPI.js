import {
  post,
  get
} from '@/utils/cost/http'
// ==================list=====================
//审核通过/驳回
export function approve(fundsYearVersionModel) {
  return post('/fundsyear/approve', fundsYearVersionModel)
}
// 查询列表
export function getList(query_obj) {
  return get('/fundsyear/hierarchyList', query_obj)
}

//删除年度资金计划
export function deleteItem(fundsYearVersionModel) {
  return post('/fundsyear/delete', fundsYearVersionModel)
}

// ==================newOrUpdate=====================
// 新增年度资金计划选择“成本分期”检查“全周期资金计划”等
/*
accountingObjectId：成本分期id
fundsYear:月度传年，年度不传
stageId：阶段id
*/
export function check(query_obj) {
  return get('/fundsyear/check', query_obj)
}

// 初始化数据
/*
id：年度资金计划id
accountingObjectId：成本分期id
fundsYear:月度传年，年度不传
stageId：阶段id
*/
export function init(query_obj) {
  return get('/fundsyear/init', query_obj)
}

// 检查已编制的年份及季度
/*
accountingObjectId：成本分期id
fundsYear:月度传年，年度不传
stageId：阶段id
*/
export function checkYearAndStage(query_obj) {
  return get('/fundsyear/checkYearAndStage', query_obj)
}

//年度资金计划
export function create(query_obj) {
  return post('/fundsyear/create', query_obj)
}

// 历史版本查看
/*
accountingObjectId：成本分期id
fundsYear:月度传年，年度不传
stageId：阶段id
*/
export function getHistoryList(query_obj) {
  return get('/fundsyear/history', query_obj)
}
