import Vue from 'vue'
import router from '../router/index'
import store from '@/store/index'
import { getLocale } from '@/api/sys/i18nAPI'
import enLocale from 'element-ui/lib/locale/lang/en'
import cnLocale from 'element-ui/lib/locale/lang/zh-CN'

import { setLocalItem, getLocalItem, Constants } from '@/utils/common/cache'
import ElementUI from 'element-ui'
import App from '../App'

Vue.use(ElementUI, { size: 'mini' })

import VueI18n from 'vue-i18n'
Vue.use(VueI18n)
export function initSys() {
  var i18nData = getLocalItem(Constants.I18N_DATA)

  if (!i18nData) {
    requestI18N((data) => {
      executData(data)
    })
  } else {
    executData(JSON.parse(i18nData))
    requestI18N()
  }
}

function requestI18N(callback) {
  getLocale()
    .then(response => {
      let data = response.data
      setLocalItem(Constants.I18N_DATA, JSON.stringify(data))
      setLocalItem(Constants.LANGSWITCH, data.langSwitch)

      var locale = getLocalItem(Constants.LOCALE)
      if (locale === null) {
        setLocalItem(Constants.LOCALE, data.defaultLocale)
      }
      if (callback) {
        callback(data)
      }
    })
    .catch(error => {
      console.log(error)
    })
}

function executData(data) {
  var messages = data.messages
  if (messages.en !== undefined) {
    messages.en = Object.assign(messages.en, enLocale)
  }
  if (messages.cn !== undefined) {
    messages.cn = Object.assign(messages.cn, cnLocale)
  }
  var defaultLocale = getLocalItem(Constants.LOCALE)

  const i18n = new VueI18n({
    locale: defaultLocale,
    messages: messages
  })
  Vue.use(ElementUI, {
    i18n: (key, value) => i18n.t(key, value)
  })

  new Vue({
    i18n,
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: { App },
    data: {
      // 空的实例放到根组件下，所有的子组件都能调用
      Bus: new Vue()
    }
  })
}
