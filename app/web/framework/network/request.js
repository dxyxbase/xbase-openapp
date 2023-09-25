/**
 * @Date: 2023-06-06 11:10:37
 * @LastEditTime: 2023-09-18 17:28:54
 * @FilePath: /openapi-demoapp/app/web/framework/network/request.js
 * @Description:
 */
import axios from 'axios'
import Message from 'ant-design-vue/es/message'
import { VueAxios } from './axios'
import storage from 'store'
import { SET_TOKEN } from '@/page/store/mutation-type'
import router from '@/page/router'
import qs from 'qs'
const whiteList = ['/api/open/v1/model/upload', '/api/open/v1/asset/upload']
const request = axios.create({
  withCredentials: true,
  xsrfHeaderName: 'x-csrf-token',
  xsrfCookieName: 'csrfToken'
})
// 通用错误代码
const authCommonErrorCode = [10001000, 10001002, 10001003, 10001004, 10001005, 10001006, 10001007, 10001008, 401]
// 异常拦截处理器
const errorHandler = error => {
  if (error.response) {
    const serverErrCode = [500, 501, 502, 503, 504, 505, 404]
    if (serverErrCode.includes(error.response.status)) {
      return false
    }
  }
  // 请求时间超出前端10s限制
  if (error.code === 'ECONNABORTED') {
    Message.warning('服务请求超时，请稍后重试')
  }
  // 网络断开
  if (error.code === 'ERR_NETWORK') {
    Message.warning('当前网络已断开连接，请稍后重试')
  }
  return Promise.reject(error)
}

request.interceptors.request.use(config => {
  const url_ = config.url
  whiteList.includes(url_) ? (config.timeout = 1000 * 10 * 60) : (config.timeout = 20000)
  const token = storage.get(SET_TOKEN)
  if (!config.headers['Authorization']) {
    config.headers['Authorization'] = 'Bearer ' + token
  }
  if (config.method === 'get') {
    config.params = {
      ...config.params,
      _t: Date.parse(new Date()) / 1000
    }
    config.paramsSerializer = function (params) {
      return qs.stringify(params, { arrayFormat: 'indices' })
    }
    // config.paramsSerializer = function (params) {
    //   return qs.stringify(params, { arrayFormat: 'brackets' })
    // }
  }
  return config
}, errorHandler)

request.interceptors.response.use(response => {
  if (response.config.responseType === 'blob') {
    return response.data
  }
  const code = response.data.code
  // 通用权限错误码
  if (authCommonErrorCode.includes(code)) {
    Message.warning(response.data.msg)
    window.localStorage.clear()
    router.push({ path: '/login' })
  } else if (code === 10001001) {
    router.push({ path: '/' })
    return Message.warning(response.data.msg)
  } else if (code !== 0) {
    return Message.warning(response.data.msg)
  }
  return response.data
}, errorHandler)

const installer = {
  vm: {},
  install(Vue) {
    Vue.use(VueAxios, request)
  }
}

export default request

export { installer as VueAxios, request as axios }
