// 深拷贝
export function deepCopy(obj) {
  try {
    return JSON.parse(JSON.stringify(obj))
  } catch (error) {
    console.log(error)
    return obj
  }
}

// null值处理 ,object为当前值 defaultValue设置的值 isNaN
export function ifNull(object, defaultValue) {
  if (!object) {
    return defaultValue
  } else {
    if (defaultValue && defaultValue == '0') {
      return isNaN(object) ? 0 : object
    } else {
      return object
    }
  }
}
