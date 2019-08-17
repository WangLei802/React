import axios from 'axios'
import {
  Message
} from 'element-ui'
import store from '../../store'
import {
  getToken
} from '@/utils/common/auth'
import {
  LoadingUtil
} from '@/utils/common/LoadingUtil'

// 创建axios实例
const service = axios.create({
  // baseURL: process.env.BASE_API, // api的base_url
})

// request拦截器
service.interceptors.request.use(config => {
  if (store.getters.token) {
    config.headers['Authorization'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改 // change by wen hao
    config.headers['Content-Type'] = 'application/json'
  }
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    console.log('res code ' + res.code)
    if (parseInt(res.code) !== 2000) {
      LoadingUtil.hideLoading()
      if (parseInt(res.code) === 4030) { // token expired
        store.dispatch('LogOut').then(() => {
          location.reload() // 为了重新实例化vue-router对象 避免bug
        })
      } else if (parseInt(res.code) === 4050) {
        // 没有权限
        Message({
          message: res.message,
          type: 'warning',
          duration: 5 * 1000,
          showClose: true
        })
        return Promise.reject(res)
      }
    }
    return response.data
  },
  error => {
    console.log('err' + error) // for debug 网络请求出错，可能服务器挂了之类的
    LoadingUtil.hideLoading()
    Message({
      message: error.message,
      type: 'warning',
      duration: 5 * 1000,
      showClose: true
    })
    return Promise.reject(error)
  }
)

export default service
