// 级别显示，exp：“1”显示为“一级”
export function FLevel(parentCode) {
  let level
  let num = parentCode ? parentCode.split('.').length : 0
  const changeNum = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'] // changeNum[0] = "零"
  const unit = ['', '十', '百', '千', '万']
  num = parseInt(num)
  const getWan = (temp) => {
    const strArr = temp.toString().split('').reverse()
    let newNum = ''
    for (var i = 0; i < strArr.length; i++) {
      newNum = (i === 0 && strArr[i] === 0 ? '' : (i > 0 && strArr[i] === 0 && strArr[i - 1] === 0 ? '' : changeNum[strArr[i]] + (strArr[i] === 0 ? unit[0] : unit[i]))) + newNum
    }
    return newNum
  }
  const overWan = Math.floor(num / 10000)
  let noWan = num % 10000
  if (noWan.toString().length < 4) noWan = '0' + noWan
  level = overWan ? getWan(overWan) + '万' + getWan(noWan) : getWan(num)
  return level + '级'
}

export function FPhase(phaseNo) {
  if (phaseNo === '_tobe') phaseNo = 0
  const changeNum = ['待分', '一', '二', '三', '四', '五', '六', '七', '八', '九'] // changeNum[0] = "零"
  return changeNum[phaseNo] + '期'
}

// 千位符
/**
 *
 * @param num
 * @param precision
 * @param separator
 * @returns {*}
 *=======================================================
 *     NumFormat(10000)="10,000"
 *     NumFormat(10000, 2)="10,000.00"
 *     NumFormat(10000.123456, 2)="10,000.12"
 *     NumFormat(10000.123456, 2, ' ')="10 000.12"
 *     NumFormat(.123456, 2, ' ')="0.12"
 *     NumFormat(56., 2, ' ')="56.00"
 *     NumFormat(56., 0, ' ')="56"
 *     NumFormat('56.')="56"
 *     NumFormat('56.a')=NaN
 *=======================================================
 */
export function NumFormat(num, placeholder, precision = 2, separator) {
  if (!num) {
    return '-'
  }
  var parts;
  // 判断是否为数字
  if (!isNaN(parseFloat(num)) && isFinite(num)) {
    // 把类似 .5, 5. 之类的数据转化成0.5, 5, 为数据精度处理做准, 至于为什么
    // 不在判断中直接写 if (!isNaN(num = parseFloat(num)) && isFinite(num))
    // 是因为parseFloat有一个奇怪的精度问题, 比如 parseFloat(12312312.1234567119)
    // 的值变成了 12312312.123456713
    num = Number(num);
    // 处理小数点位数
    num = (typeof precision !== 'undefined' ? num.toFixed(precision) : num).toString();
    // 分离数字的小数部分和整数部分
    parts = num.split('.');
    // 整数部分加[separator]分隔, 借用一个著名的正则表达式
    parts[0] = parts[0].toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1' + (separator || ','));

    return parts.join('.');
  }
  return NaN;
}
export function NumFormatNormal(num, placeholder, precision, separator) {
  var parts;
  // 判断是否为数字
  if (!isNaN(parseFloat(num)) && isFinite(num)) {
    // 把类似 .5, 5. 之类的数据转化成0.5, 5, 为数据精度处理做准, 至于为什么
    // 不在判断中直接写 if (!isNaN(num = parseFloat(num)) && isFinite(num))
    // 是因为parseFloat有一个奇怪的精度问题, 比如 parseFloat(12312312.1234567119)
    // 的值变成了 12312312.123456713
    num = Number(num);
    // 处理小数点位数
    num = (typeof precision !== 'undefined' ? num.toFixed(precision) : num).toString();
    // 分离数字的小数部分和整数部分
    parts = num.split('.');
    // 整数部分加[separator]分隔, 借用一个著名的正则表达式
    parts[0] = parts[0].toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1' + (separator || ','));

    return parts.join('.');
  }
  return NaN;
}
// 版本
export function Version(value) {
  return value ? ('V' + value) : ''
}

// datatime  {{datatime | dataFormat('yyyy-MM-dd hh:mm:ss')}}
export function dateFormat(value, fmt = 'yyyy-MM-dd hh:mm:ss') {
  if (!value) return ''
  if (value.length > fmt.length) value = value.substring(0, fmt.length)
  if (value.length === 28) value = value.substring(0, 19)
  if (value) value = value.replace(/-/g, '/').replace(/T|Z/g, ' ').trim()
  let getDate = new Date(value) //.replace(/\-/g, "/")
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
    fmt = fmt.replace(RegExp.$1, (getDate.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (let k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }
  return fmt
}

// 字数截取
export function cutString(value, max, wordwise, tail) {
  if (!value) return '';
  max = parseInt(max, 10);
  if (!max) return value;
  if (value.length <= max) return value;

  value = value.substr(0, max);
  if (wordwise) {
    var lastspace = value.lastIndexOf(' ');
    if (lastspace != -1) {
      value = value.substr(0, lastspace);
    }
  }

  return value + (tail || ' …');
}

// 比例
/*
 *=======================================================
 *   rateFormat(0.01) ==> 0.01%
 *   rateFormat(0.01,true) ==> 1%
 *=======================================================
 */
export function rateFormat(value, format = false, unit) {
  unit = typeof (unit) === "undefined" ? false : true
  if (!isNaN(Number(value))) {
    return value ? (format ? value * 100 : value).toString() + (unit ? '%' : '') : '-'
  } else {
    return '-'
  }
}
