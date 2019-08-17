import {
  setLocalItem,
  getLocalItem,
  Constants
} from '@/utils/common/cache'
import {
  getMyPermission
} from '@/api/platform/permissionAPI'
import Vue from 'vue'
export function getMyPermissions() {
  setLocalItem(Constants.MYPERMISSION, '')
  try {
    getMyPermission().then(response => {
      const data = response.data || []
      let dataMapping = {}
      data.forEach((v, k) => {
        if (v.code) {
          dataMapping[v.code] = v
        }
      })
      setLocalItem(Constants.MYPERMISSION, JSON.stringify(dataMapping))
    }).catch(error => {
      console.log(error)
    })
  } catch (e) {
    console.log(e)
  }
}
Vue.prototype.$checkPersmissionByCode = function (code) {
  const data = JSON.parse(getLocalItem(Constants.MYPERMISSION))
  // console.log('$checkPersmissionByCode ')
  // console.log(data)
  if (data) {
    const parameter = data[code]
    if (parameter) {
      return true
    }
    return false
  }
  return false
}
