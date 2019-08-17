const getters = {
  sidebar: state => state.app.sidebar,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  roles: state => state.user.roles,
  addRouters: state => state.permission.addRouters,
  fullHeight: state => state.fullHeight,
  showForm: state => state.showForm,
  selectOrg: state => state.user.selectOrg,
  fullWidth: state => state.fullWidth,
  fullScreen: state => state.fullScreen, //是否为全屏状态
}
export default getters
