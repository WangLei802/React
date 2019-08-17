import { post, get } from '@/utils/sys/http'

export function saveWidgetDatasource(obj) {
  return post('/widget/datasource/create', obj)
}
export function updateWidgetDatasource(obj) {
  return post('/widget/datasource/update', obj)
}
export function deleteWidgetDatasource(id) {
  return get('/widget/datasource/delete/' + id)
}
export function searchWidgetDatasourceList(queryObj) {
  return get('/widget/datasource/query', queryObj)
}

export function getWidgetDatasource(moduleType, widgetType) {
  return get('widget/datasource/query' + moduleType + '/' + widgetType)
}

export function getWidgetdatasourceDetail(id) {
  return get('/widget/datasource/detail/' + id)
}
