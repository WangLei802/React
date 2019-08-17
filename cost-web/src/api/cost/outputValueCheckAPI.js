import {
  post,
  get
} from '@/utils/cost/http'

export function searchList(projectModel) {
  return get('/outputValueCheck/list', projectModel)
}
// 产值核定新增
export function createOutputValue(projectModel) {
  return post('/outputValueCheck/create', projectModel)
}
// 产值核定复核
export function approveOutputValue(projectModel) {
  return post('/outputValueCheck/approve', projectModel)
}

// 删除
export function deleteOutputValue(projectModel) {
  return post('/outputValueCheck/delete', projectModel)
}
// 产值核定更新
export function updateOutputValue(projectModel) {
  return post('/outputValueCheck/update', projectModel)
}

// 产值核定详细查询
export function getOutputValue(projectModel) {
  return get('/outputValueCheck/get', projectModel)
}

// 合同编号返回数据
export function getNewFormOutputValue(projectModel) {
  return get('/outputValueCheck/newForm', projectModel)
}
