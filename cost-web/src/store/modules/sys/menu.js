import {
  getMenu
} from '@/api/sys/portalAPI'
import {
  getLocalItem,
  setLocalItem,
  Constants
} from '@/utils/common/cache'

const menu = {
  state: {
    data: [],
    currentMenuName: '',
    leftMenu: [],
    firstMenuId: '',
  },
  getters: {
    allMenu: state => {
      state.data = JSON.parse(getLocalItem(Constants.MENU))
      return state.data
    },
    getCurrentMenuName: state => {
      state.currentMenuName = getLocalItem(Constants.CURRENT_MENUNAME)
      return state.currentMenuName
    },
    getLeftMenu: state => {
      var dataObj = JSON.parse(getLocalItem(Constants.LEFT_MENU))
      var munuArr = []
      if (dataObj) {
        munuArr.push(dataObj)
      }
      state.leftMenu = munuArr
      return state.leftMenu
    },
    getFirstMenu: state => {
      state.firstMenuId = getLocalItem(Constants.CURRENT_MENUID)
      return state.firstMenuId
    }
  },

  actions: {
    getAllMenu({
      commit
    }) {
      return new Promise((resolve, reject) => {
        getMenu()
          .then(response => {
            let data = response.data ? response.data : []
            let path_value = {
              '/dashboard': 'CostManager'
            }
            // 处理菜单数据， 父级名称
            function getAllParentName(v) {
              v.count = ''
              if (v.children) {
                v.children.forEach((c) => {
                  if (v.parentName === undefined) {
                    v.parentName = ''
                  }
                  c.count = ''
                  c.parentName = v.parentName + ',' + v.menuNameEn
                  if (c.clientRouter && c.clientRouter.path) {
                    path_value[c.clientRouter.path] = (c.parentName || '') + ',' + c.menuNameEn
                  }
                  if (c.children && c.children.length) {
                    getAllParentName(c)
                  }
                })
              }
            }
            // 给menu添加字段count
            data.forEach((v) => {
              getAllParentName(v)
            })
            // 面包屑：根据路径取值
            setLocalItem(Constants.PATH_VALUE, JSON.stringify(path_value))
            commit('setMenuData', data)
            resolve()
            window.initOriginPage && window.initOriginPage()
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    setCurrentMenu({
      commit
    }, menu) {
      commit('setCurrentMenuName', menu.currentMenuName)
    },
    setLeftMenuObj({
      commit
    }) {
      commit('setLeftMenu', getLocalItem(Constants.LEFT_MENU))
    },
    getFirstMenu({
      commit
    }) {
      commit('setFirstMenuId', getLocalItem(Constants.CURRENT_MENUID))
    }
  },

  mutations: {
    setMenuData: (state, data) => {
      setLocalItem(Constants.MENU, JSON.stringify(data))
      state.data = data
    },
    setCurrentMenuName: (state, data) => {
      setLocalItem(Constants.CURRENT_MENUNAME, data)
      state.currentMenuName = data
    },
    setLeftMenu: (state, data) => {
      state.leftMenu = data
    },
    setFirstMenuId: (state, data) => {
      state.firstMenuId = data
    }
  }
}
export default menu
