import {
  getRootPath
} from '@/utils/common/utils'
const sys_config = {
  SSO: {
    isSSO: true,
    url: getRootPath() + '/api/inner/cost/sso/login',
    logoutUrl: getRootPath() + '/api/inner/cost/sso/logout',
    api: {
      name: 'ssoLogin',
      paramName: 'token'
    }
  },
  // 配置左侧菜单
  menu: [
    // {
    //   menuName: 'UnReadNotification',
    //   api: '/notification/user/msgInterval',
    //   timeInterval: '60', // 时间，单位s
    //   needPolling: 1, // 1是，2否
    //   eventName: 'setLeftMenuObj', // 需要发送的事件名称，该事件用来更新菜单的数值,
    //   columnName: 'length'
    // }
  ],
  expandedLevel: 2, //科目树默认展开level级别
  href_cct: 'http://47.100.12.43:8080/help/ssoLogin?redirectUrl=http://47.100.12.43:8080/help/form.action' //右上角cct提问链接地址
}

export default sys_config
