import { post, get } from '@/utils/sys/http'

export function getUsageInformation() {
  return get('/usageInformation')
}

export function getLogoUrlByImageCode(imageCode) {
  return get('/file/image/' + imageCode)
}

export function createUsageInformation(usageInformation) {
  return post('/usageInformation/create', usageInformation)
}

export function updateUsageInformation(usageInformation) {
  return post('/usageInformation/update', usageInformation)
}
