import { get, post } from '@/utils/cost/http'

export function listAccountingObjectSettingTree(body) {
  return get('/accountingObjectSetting/list', body)
}

// 更新分期确定规则
export function updateAccountingObjectSetting(body) {
  return post('/accountingObjectSetting/update', body)
}

