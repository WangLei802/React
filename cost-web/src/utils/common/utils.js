import Vue from 'vue'
import {
  Message
} from 'element-ui'
import {
  formatI18N
} from '@/utils/sys/LangUtil'
import {
  getLangValue
} from '@/utils/sys/LangUtil'
Vue.prototype.$showSuccess = function (value = '', duration = 5000) {
  if (value !== '') {
    var message = getLangValue(value)
    Message.closeAll()
    this.$message({
      message: message,
      type: 'success',
      showClose: true,
      duration: duration
    })
  }
}

Vue.prototype.$showError = function (value = '', duration = 5000) {
  if (value !== '') {
    var message = getLangValue(value)
    Message.closeAll()
    this.$message.error({
      message: message,
      type: 'error',
      showClose: true,
      duration: duration
    })
  }
}
Vue.prototype.$showNormalSuccess = function (value = '', duration = 5000) {
  if (value !== '') {
    var message = getLangValue(value)
    Message.closeAll()
    this.$message({
      message: message,
      type: 'success',
      showClose: true,
      duration: duration
    })
  }
}

Vue.prototype.$showNormalError = function (value = '', duration = 5000) {
  if (value !== '') {
    var message = getLangValue(value)
    Message.closeAll()
    this.$message.error({
      message: message,
      type: 'error',
      showClose: true,
      duration: duration
    })
  }
}

Vue.prototype.$showWarning = function (value = '', duration = 5000) {
  if (value !== '') {
    var message = getLangValue(value)
    Message.closeAll()
    this.$message({
      message: message,
      type: 'warning',
      showClose: true,
      duration: duration
    })
  }
}

Vue.prototype.$l = function (value = '', placeholder) {
  if (value === '' || value === null) {
    return ''
  }
  var result = this.$t('multilang.' + value)
  result = formatI18N(result, placeholder)

  return result
}

Vue.prototype.$ls = function (value = '') {
  if (value === '' || value === null) {
    return this.$t('multilang.lbl_colon')
  }
  return this.$t('multilang.' + value) + this.$t('multilang.lbl_colon')
}

Vue.prototype.$checkLocaleIsCn = function () {
  return this._i18n.locale === 'cn'
}

Vue.prototype.$getTableIndex = function (queryObj) {
  return queryObj.pageSize * (queryObj.pageNum - 1) + 1
}

// global.print = function (content) {
//   // console.log(content)
// }
Vue.prototype.$dateFormat = function (props, fmt = 'yyyy-MM-dd hh:mm:ss') {
  return (row, column) => {
    //return new Date(row[props]).format(fmt)
    if (!row[props]) return ''
    let value = row[props]
    if (typeof (value) === 'number') {
      return new Date(value).format(fmt)
    }
    if (value.length === 28) value = value.substring(0, 19)
    value = value.replace(/-/g, '/').replace(/T|Z/g, ' ').trim()
    let getDate = new Date(value) //.replace(/\-/g, "/")
    let formatDate = ""
    let o = {
      'M+': getDate.getMonth() + 1,
      'd+': getDate.getDate(),
      'h+': getDate.getHours(),
      'm+': getDate.getMinutes(),
      's+': getDate.getSeconds(),
      'q+': Math.floor((getDate.getMonth() + 3) / 3),
      'S': getDate.getMilliseconds()
    }
    if (/(y+)/.test(fmt)) {
      formatDate = fmt.replace(RegExp.$1, (getDate.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    for (let k in o) {
      if (new RegExp('(' + k + ')').test(formatDate)) {
        formatDate = formatDate.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
      }
    }
    return formatDate
  }
}

export function showErrorDialog(message) {
  Message({
    message: message,
    type: 'error',
    showClose: true
  })
}

export function getRootPath() {
  let href = window.location.href
  let pathname = window.location.pathname
  return href.substr(0, href.indexOf(pathname))
}

// 获取用户信息
Vue.prototype.$getUserInfo = function () {
  try {
    return JSON.parse(JSON.parse(localStorage.getItem('USER_INFO')).val)
  } catch (e) {
    return {}
  }
}
