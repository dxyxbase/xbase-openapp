/**
 * @Date: 2023-06-06 18:44:22
 * @LastEditTime: 2023-06-16 11:12:22
 * @FilePath: /openapi-demoapp/app/web/apis/port.js
 * @Description:前端视点接口
 */
import request from 'framework/network/request'
export const port_list = params => {
  return request({
    url: '/api/open/v1/viewport/viewports',
    method: 'GET',
    params
  })
}
export const scene_detail = params => {
  return request({
    url: '/api/open/v1/viewport/viewport',
    method: 'GET',
    params
  })
}
export const port_add = data => {
  return request({
    url: '/api/open/v1/viewport/add',
    method: 'POST',
    data: data
  })
}
export const port_del = data => {
  return request({
    url: '/api/open/v1/viewport/delete',
    method: 'POST',
    data: data
  })
}
