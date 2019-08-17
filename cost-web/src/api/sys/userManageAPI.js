import { post, get } from '@/utils/sys/http'

export function searchUserList(body) {
  return get('/org/user/list', body)
}

export function searchUserListRecursion(body) {
  return get('/org/user/listRecursion', body)
}

export function userLifecycle(body) {
  return post('/user/status/update', body)
}

export function newOrUpdateUser(body) {
  var url = ''
  var requestBody = {
    'username': body.username,
    'nickName': body.nickName,
    'email': body.email,
    'mobile': body.mobile,
    'phone': body.phone,
    'sex': body.sex,
    'sign': body.sign,
    'version': body.version
  }
  if (body.id) {
    url = '/user/update'
    requestBody.id = body.id
  } else {
    url = '/user/create'
  }
  return post(url, requestBody)
}

export function getUserDetail(id) {
  return get('/user/detail/' + id)
}

export function resetPassword(body) {
  return post('/user/resetPassword', body)
}

export function getUserPositions(body) {
  return get('/userposition/user/positionNames', body)
}

export function getUserOrgs(body) {
  return get('/org/user/orgNames', body)
}

