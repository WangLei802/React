import { post, get } from '@/utils/cost/http'

// 获取一级分类
export function getFirstCategory() {
  return get('/contractPlan/getFirstCategory')
}

// 获取二级分类
export function getSecondCategory(obj) {
  return get('/contractPlan/getSecondCategory', obj)
}

