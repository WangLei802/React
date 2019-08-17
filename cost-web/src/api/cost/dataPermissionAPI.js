import { get, post } from '@/utils/cost/http'

// 获取组织下的用户信息
export function getProjectTree(body) {
  return get('/project/tree', body)
}

// 获取组织下的用户信息
export function listUserByProjectCode(body) {
  return get('/dataPermission/project/getUser', body)
}

// 保存
export function saveUsersToProject(body) {
  return post('/dataPermission/project/create', body)
}

// 获取用户权限下的所有用户
export function getUsersByPermission(body) {
  return get('/dataPermission/project/getUserByPermission', body)
}

// 获取合同类型列表
export function getContractTypes(body) {
  return get('/dataPermission/contractType/getContractTypes', body)
}

// 保存合同类型-角色关联
export function saveCotractTypeRole(body) {
  return post('/dataPermission/contractType/create', body)
}

// 保存合同类型-角色关联
export function getRoleList(body) {
  return get('/dataPermission/contractType/getRoles', body)
}

// 获取功能模块列表
export function getModuleList(body) {
    return get('/dataPermission/contractType/getModules', body)
}

