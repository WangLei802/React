import {
  login,
  getInfo,
} from '@/api/sys/loginAPI'

import {
  ticketLogin
} from '@/api/cost/loginAPI'

import {
  getToken,
  setToken,
  removeToken
} from '@/utils/common/auth'

import {
  setLocalItem,
  Constants,
  getLocalItem
} from '@/utils/common/cache'

import {
  getSSO,
  removeSSO
} from '@/utils/common/sso'

const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    roles: [],
    isLoginOut: false,
    selectOrg: {
      id: null,
      text: null
    },
    isFromBpm: false //是否为bmp原单
  },

  mutations: {
    SET_ISFROMBPM: (state, isFromBpm) => {
      state.isFromBpm = isFromBpm
    },
    SET_ISLOGINOUT: (state, isLoginOut) => {
      state.isLoginOut = isLoginOut
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_SELECT_ORG: (state, selectOrg) => {
      state.selectOrg = selectOrg
    }

  },

  actions: {
    SETIsBpmFrom({
      commit
    }, isFromBpm) {
      commit('SET_ISFROMBPM', isFromBpm)
    },
    // 登录
    Login({
      commit
    }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        login(username, userInfo.password).then(response => {
          if (response.code === '2000') {
            const data = response.data
            setToken(data)
            commit('SET_TOKEN', data)
            window.loginPrepare && window.loginPrepare()
          }
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // sso url 跳转
    SSOLogin(param) {
      let ssourl = JSON.parse(getSSO()).url
      let href = encodeURIComponent(window.location.href)
      setLocalItem(Constants.SSO_HREF, href)
      window.location.href = ssourl + '?service=' + href
    },
    // ticket 换token
    ticketLogin({
      commit
    }, ticket) {
      let ssourl = JSON.parse(getSSO()).url // try store
      let service = getLocalItem(Constants.SSO_HREF)
      return new Promise((resolve, reject) => {
        ticketLogin(ticket, ssourl, service).then(response => {
          if (response.code === '2000') {
            const data = response.data
            setToken(data)
            commit('SET_TOKEN', data)
            window.loginPrepare && window.loginPrepare()
          }
          resolve(response)
          setLocalItem(Constants.ISLOADING, false)
        }).catch(error => {
          reject(error)
          setLocalItem(Constants.ISLOADING, false)
        })
      })
    },
    // 获取用户信息
    GetInfo({
      commit,
      state
    }) {
      return new Promise((resolve, reject) => {
        getInfo(state.token).then(response => {
          const data = response.data
          commit('SET_ROLES', data.authorities)
          commit('SET_NAME', data.username)
          commit('SET_AVATAR', data.avatar)

          // 保存用户信息到sessionStorage
          setLocalItem(Constants.USER_INFO, JSON.stringify(data))

          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut({
      commit,
      state
    }) {
      return new Promise((resolve, reject) => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        commit('SET_ISLOGINOUT', true)
        removeToken()
        resolve()
      })
    },

    // 前端 登出
    FedLogOut({
      commit
    }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
