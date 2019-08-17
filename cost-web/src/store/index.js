import Vue from 'vue'
import Vuex from 'vuex'
import app from './app'
import user from './modules/sys/user'
import menu from './modules/sys/menu'
import permission from './modules/permission'
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    user,
    permission,
    menu
  },
  state: {
    themecolor: 'custom-4DA1FF',
    fullHeight: document.documentElement.clientHeight,
    fullWidth: document.documentElement.clientWidth,
    showForm: false,
    fullScreen: false,
  },
  mutations: {
    setThemeColor(state, curcolor) {
      this.state.themecolor = curcolor
    },
    setFullHeight(state, fullHeight) {
      this.state.fullHeight = fullHeight
    },
    setFullWidth(state, fullWidth) {
      this.state.fullWidth = fullWidth
    },
    setShowForm(state, showForm) {
      this.state.showForm = showForm
    },
    setFullScreen(state, fullScreen) {
      this.state.fullScreen = fullScreen
    },
  },
  getters
})

export default store
