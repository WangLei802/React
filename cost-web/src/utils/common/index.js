export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (('' + time).length === 10) time = parseInt(time) * 1000
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

export function getParameterValueByName(url, name) {
  var param = url.split('?')
  if (param.length === 1) return null
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  var r = param[1].match(reg);
  if (r != null) return unescape(r[2]);
  return null;
}

export function formatTime(time, option) {
  time = +time * 1000
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) { // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return d.getMonth() + 1 + '月' + d.getDate() + '日' + d.getHours() + '时' + d.getMinutes() + '分'
  }
}

export function toggleClass(element, className) {
  if (!element || !className) {
    return
  }
  element.className = className
}
/*
 * obj==>this
 * formHeight:为筛选元素的高度，第一次获取不到该元素，这里手动传值
 * */
export function tableHeight(options) {
  let {
    fullHeight,
    opened,
    showForm,
    obj,
    formHeight = 86,
    hasPage = true,
    otherHeight = 163
  } = options
  fullHeight = document.documentElement.clientHeight
  let page = document.getElementsByClassName('el-pagination')
  let banner = document.getElementsByClassName('navbar')
  let bannerHeight = banner.length ? banner[0].offsetHeight : 0
  let pageHeight = page.length ? page[0].offsetHeight : 0
  let tableHeight = fullHeight -
    Number(opened ? 0 : -1) * (bannerHeight + 25) -
    Number(showForm || 0) * formHeight - pageHeight - otherHeight - (obj.isFirst ? 0 : hasPage ? 0 : 0)
  obj.isFirst = true
  return tableHeight
}
