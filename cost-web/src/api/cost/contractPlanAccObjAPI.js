import {
    post,
    get
  } from '@/utils/cost/http'
  
  // 查询
  export function listAllContractPlanAccObjTree(query_obj) {
    return get('/contractPlan/accObj/listAll', query_obj)
  }
  
  
  // 更新
  export function saveOrUpdateCpAccObj(query_obj) {
    return post('/contractPlan/accObj/saveOrUpdateCpAccObj', query_obj)
  }
  

  