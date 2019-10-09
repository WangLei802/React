import {
    post,
    get
  } from '@/request/http'
  
  // 成本分期公共信息查询
  export function product(param) {
    return get('/product', param)
  }
  