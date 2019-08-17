import request from '@/utils/common/request'
import { getLangValue } from '@/utils/sys/LangUtil'
import { showErrorDialog } from '@/utils/common/utils'

const BASE_API = process.env.BASE_API

function sendHttpRequest(requests) {
  return new Promise((resolve, reject) => {
    requests.then(response => {
      if (parseInt(response.code) !== 2000) {
        var message = getLangValue(response.message, response.placeholder)
        showErrorDialog(message)

        reject(response) // 返回错误
      } else {
        resolve(response) // 返回成功
      }
    }).catch(error => {
      console.log('catch' + error)
      // 404
    })
  })
}

export function post(url, param = '', prefixUrl = BASE_API) {
  return sendHttpRequest(
    request({
      url: prefixUrl + url,
      method: 'post',
      data: param }))
}

export function put(url, param = '', prefixUrl = BASE_API) {
  return sendHttpRequest(
    request({
      url: prefixUrl + url,
      method: 'put',
      data: param }))
}

export function deletes(url, param = '', prefixUrl = BASE_API) {
  return sendHttpRequest(
    request({
      url: prefixUrl + url,
      method: 'delete',
      data: param }))
}

export function get(url, param = '', prefixUrl = BASE_API) {
  return sendHttpRequest(
    request({
      url: prefixUrl + url,
      method: 'get',
      params: param }))
}

export function post_param(url, param = '', prefixUrl = BASE_API) {
  return sendHttpRequest(
    request({
      url: prefixUrl + url,
      method: 'post',
      params: param }))
}

