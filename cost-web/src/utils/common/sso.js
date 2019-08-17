import Cookies from 'js-cookie'

export function isSSO() {
  return Cookies.get('isSSO')
}
export function getSSO() {
  return Cookies.get('SSO')
}
export function setSSO(SSO) {
  return Cookies.set('SSO', SSO)
}
export function setIsSSO(isSSO) {
  return Cookies.set('isSSO', isSSO)
}

export function removeSSO(isSSO) {
  Cookies.remove('isSSO')
  Cookies.remove('SSO')
}
