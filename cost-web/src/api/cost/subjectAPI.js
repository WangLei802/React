import { post, get, download } from '@/utils/cost/http'

export function searchAuditLogList(query_obj) {
  return get('/log/query', query_obj)
}

// 获取科目列表
export function getSubjectList(query_obj) {
  return get('/subject/query', query_obj)
}

// 保存或更新科目
export function saveOrUpdateSubject(obj) {
  return post('/subject/save', obj)
}

// 获取科目excel表格模版，从文件系统（后期文档中心提供上传下载）获取表格提供下载。
export function getSubjectTemplate() {
  return get('/subject/downloadTemplate')
}

// 获取科目excel表格数据，数据为当前页面科目数据
export function exportSubjectData(obj) {
  return get('/subject/exportSubjectData', obj)
}

// 上传科目excel表格数据，页面显示，并不插入数据库，待用户保存。
export function importSubjectData(obj) {
  return post('/subject/importSubjectData', obj)
}

// 删除科目
export function deleteGroupSubject(obj) {
  return post('/subject/delete', obj)
}

// 生成科目编码
export function generateCode(parentCode) {
  return get('/subject/generateCode', parentCode)
}

// 更改科目状态
export function changeStatus(obj) {
  return post('/subject/changeStatus', obj)
}
