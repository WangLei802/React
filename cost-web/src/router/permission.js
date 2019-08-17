import router from './../router'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css' // Progress 进度条样式
import {
  getToken
} from '@/utils/common/auth' // 验权
import {
  getAllClientRouters
} from '@/api/platform/clientRouterAPI'
import {
  setLocalItem,
  getLocalItem,
  Constants
} from '@/utils/common/cache'
import RouterExecutor from './RouterExecutor'
import store from '../store'
import {
  getParameterValueByName
} from '@/utils/common/index'
import {
  isSSO
} from '@/utils/common/sso' // 是否是sso登录
const whiteList = ['/login'] // 不重定向白名单
if (getToken()) {
  // 获取动态路由
  let clientRouterCache = getLocalItem(Constants.CLIENT_ROUTERS)
  // console.log('获取动态路由')
  // console.log(clientRouterCache)
  if (clientRouterCache == null || clientRouterCache.length === 0) {
    // 不存在
    getAllClientRouters().then(response => {
      // console.log(response)
      setLocalItem(Constants.CLIENT_ROUTERS, JSON.stringify(response.data))
      var data = []
      RouterExecutor(data, response.data)
      router.addRoutes(data)
    }).catch(error => {
      console.log(error)
    })
  } else {
    var clientRouterCacheArray = JSON.parse(clientRouterCache)
    console.log(clientRouterCacheArray)
    var data = []
    RouterExecutor(data, clientRouterCacheArray)
    router.addRoutes(data)
  }
}

router.beforeEach((to, from, next) => {
  NProgress.start()
  console.log('lsloading')
  console.log(Constants.ISLOADING)
  if (getLocalItem(Constants.ISLOADING)) {
    return
  }
  // 内页拦截
  if (to.path === '/login') {
    if (getToken()) {
      next({
        path: '/'
      }) // dashboard
    } else {
      if (whiteList.indexOf(to.path) !== -1) {
        next()
      } else {
        next('/login')
        NProgress.done()
      }
    }
    return
  }
  //console.log(isSSO())
  console.log('pageLoad Start:' + new Date().getTime())
  // 页面需要时使用sso登录
  if (Number(isSSO())) {
    if (!getToken()) {
      // debugger
      let href = window.location.href // 兼容性
      let ticket = getParameterValueByName(href, 'SysTokenResponse')
      // debugger
      if (ticket) { // url存在 ticket
        setLocalItem(Constants.ISLOADING, true)
        store.dispatch('ticketLogin', ticket)
        return
      } else { // 不存在ticket sso登录
        store.dispatch('SSOLogin')
        return
      }
    }
  }
  if (getToken()) {
    if (to.path === '/login') {
      next({
        path: '/'
      })
    } else {
      next()
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next('/login')
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})
