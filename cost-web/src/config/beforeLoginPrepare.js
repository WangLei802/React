import { getLangTypeList } from '@/api/sys/i18nAPI'
import { logetInitData } from '@/api/sys/loginAPI'
import { Constants, setLocalItem, getLocalItem } from '@/utils/common/cache'
import { getSSO, setSSO, setIsSSO } from '@/utils/common/sso'
// store

import sys_config from '@/config/config.js'

export function beforeLoginPrepare() {
  var companyInfo = getLocalItem(Constants.COMPANY)
  var langType = getLocalItem(Constants.LANG_TYPE)
  var SSO = getSSO()
  !companyInfo && initCompanyInfo()
  !langType && initLangTypeList()
  SSO === undefined && initSSO()
}

function initCompanyInfo() {
  logetInitData()
    .then(response => {
      setLocalItem(Constants.THEMESWITCH, response.data.themeSwitch)
      setLocalItem(Constants.COMPANY, JSON.stringify(response.data.usageInformation))
    })
    .catch(error => {
      console.log(error)
    })
}

function initSSO() {
  setSSO(sys_config.SSO)
  setIsSSO(Number(sys_config.SSO.isSSO || 0))
}

function initLangTypeList() {
  getLangTypeList()
    .then(response => {
      setLocalItem(Constants.LANG_TYPE, JSON.stringify(response.data))
    })
    .catch(error => {
      console.log(error)
    })
}
