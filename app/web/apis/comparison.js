/**
 * @Date: 2023-06-06 18:44:22
 * @LastEditTime: 2023-06-16 11:12:22
 * @FilePath: /openapi-demoapp/app/web/apis/comparison.js
 * @Description:前端模型对比接口
 */
import request from 'framework/network/request'
export const comparison_lists = params => {
  return request({
    url: '/api/open/v1/model-diff/list',
    method: 'GET',
    params
  })
}
export const comparison_content = params => {
  return request({
    url: '/api/open/v1/model-diff/content',
    method: 'GET',
    params
  })
}

export const comparison_content_property = params => {
    return request({
      url: '/api/open/v1/model-diff/content/property',
      method: 'GET',
      params
    })
  }
export const comparison_create = data => {
  return request({
    url: '/api/open/v1/model-diff/create',
    method: 'POST',
    data: data
  })
}
export const comparison_del = data => {
  return request({
    url: '/api/open/v1/model-diff/delete',
    method: 'POST',
    data: data
  })
}

export const comparison_cancel = data => {
    return request({
        url: '/api/open/v1/model-diff/cancel',
        method: 'POST',
        data: data
    })
}

export const comparison_export = data => {
    return request({
        url: '/api/open/v1/model-diff/export',
        method: 'POST',
        data: data
    })
}