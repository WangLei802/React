import { get } from '@/utils/sys/http'

// 查询我的权限
export function getMyPermission() {
  return get('/permission/myPermission/listAll')
}
