// store/permission.js
import { constantRouterMap } from '@/router/index'
import { getMenu } from '@/api/sys/portalAPI'

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      return new Promise((resolve, reject) => {
        getMenu()
          .then(response => {
            let data = response.data ? response.data : []
            commit('SET_ROUTERS', data)
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    }
  }
}

export default permission
