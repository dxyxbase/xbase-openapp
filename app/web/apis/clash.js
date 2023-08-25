/**
 * @Date: 2023-06-06 18:44:22
 * @LastEditTime: 2023-06-16 11:12:22
 * @FilePath: /openapi-demoapp/app/web/apis/clash.js
 * @Description:前端碰撞检查接口
 */
import request from 'framework/network/request'
export const clash_lists = params => {
  return request({
    url: '/api/open/v1/clash/list',
    method: 'GET',
    params
  })
}
export const clash_content = params => {
  return request({
    url: '/api/open/v1/clash/content',
    method: 'GET',
    params
  })
}
export const clash_create = data => {
  return request({
    url: '/api/open/v1/clash/clash',
    method: 'POST',
    data: data
  })
}
export const clash_del = data => {
  return request({
    url: '/api/open/v1/clash/delete',
    method: 'POST',
    data: data
  })
}

export const clash_cancel = data => {
    return request({
        url: '/api/open/v1/clash/cancel',
        method: 'POST',
        data: data
    })
}