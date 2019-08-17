import {
  post,
  get
} from '@/utils/cost/http'

export function searchList(projectModel) {
  return get('/project/list', projectModel)
}

