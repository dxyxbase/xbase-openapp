/**
 * @Date: 2023-07-11 15:25:54
 * @LastEditTime: 2023-07-13 17:07:33
 * @FilePath: /openapi-demoapp/app/web/apis/data.js
 * @Description:
 */
import request from 'framework/network/request'
export const template_download = () => {
  return request({
    url: '/api/open/v1/template/download',
    method: 'GET',
    responseType: 'blob'
  })
}
export const standard_model_import = data => {
  return request({
    url: '/api/open/v1/standardization/standard/upload',
    data: data,
    method: 'POST'
  })
}
export const check = params => {
  return request({
    url: '/api/open/v1/standardization/standard/check-name',
    method: 'GET',
    params
  })
}
export const standard_model_list = params => {
  return request({
    url: '/api/open/v1/standardization/standard',
    method: 'GET',
    params
  })
}

export const standard_model_del = data => {
  return request({
    url: '/api/open/v1/standardization/standard/delete',
    data: data,
    method: 'POST'
  })
}
export const standard_model_edit = data => {
  return request({
    url: '/api/open/v1/standardization/standard/update',
    data: data,
    method: 'POST'
  })
}
export const standard_attr_list = params => {
  return request({
    url: '/api/open/v1/standardization/property',
    method: 'GET',
    params
  })
}
export const standard_attr_add = data => {
  return request({
    url: '/api/open/v1/standardization/property',
    data: data,
    method: 'POST'
  })
}
export const standard_attr_edit = data => {
  return request({
    url: '/api/open/v1/standardization/property/update',
    data: data,
    method: 'POST'
  })
}
export const standard_attr_del = data => {
  return request({
    url: '/api/open/v1/standardization/property/delete',
    data: data,
    method: 'POST'
  })
}
export const standard_attr_check = params => {
  return request({
    url: '/api/open/v1/standardization/property/check-name',
    method: 'GET',
    params
  })
}

export const standard_attr_copy = data => {
  return request({
    url: '/api/open/v1/standardization/property/copy',
    data: data,
    method: 'POST'
  })
}
export const model_child_list = data => {
  return request({
    url: '/api/open/v1/standardization/standard/children/list',
    data: data,
    method: 'POST'
  })
}
export const model_is_publish = data => {
  return request({
    url: '/api/open/v1/standardization/standard/is-publish',
    data: data,
    method: 'POST'
  })
}
export const model_publish = data => {
  return request({
    url: '/api/open/v1/standardization/standard/publish',
    data: data,
    method: 'POST'
  })
}
export const model_child_add = data => {
  return request({
    url: '/api/open/v1/standardization/standard/children',
    data: data,
    method: 'POST'
  })
}
export const model_child_edit = data => {
  return request({
    url: '/api/open/v1/standardization/standard/children/update',
    data: data,
    method: 'POST'
  })
}
export const model_child_del = data => {
  return request({
    url: '/api/open/v1/standardization/standard/children/delete',
    data: data,
    method: 'POST'
  })
}
export const model_child_move = data => {
  return request({
    url: '/api/open/v1/standardization/standard/children/move',
    data: data,
    method: 'POST'
  })
}
export const attr_child_check = params => {
  return request({
    url: '/api/open/v1/standardization/property/children/check-name',
    method: 'GET',
    params
  })
}
export const attr_child_list = params => {
  return request({
    url: '/api/open/v1/standardization/property/children',
    method: 'GET',
    params
  })
}
export const attr_child_add = data => {
  return request({
    url: '/api/open/v1/standardization/property/children',
    data: data,
    method: 'POST'
  })
}
export const attr_child_edit = data => {
  return request({
    url: '/api/open/v1/standardization/property/children/update',
    data: data,
    method: 'POST'
  })
}
export const attr_child_del = data => {
  return request({
    url: '/api/open/v1/standardization/property/children/delete',
    data: data,
    method: 'POST'
  })
}
export const attr_child_move = data => {
  return request({
    url: '/api/open/v1/standardization/property/children/move',
    data: data,
    method: 'POST'
  })
}
