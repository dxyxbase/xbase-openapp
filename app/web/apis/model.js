/**
 * @Date: 2023-06-06 18:44:22
 * @LastEditTime: 2023-06-26 17:41:19
 * @FilePath: /openapi-demoapp/app/web/apis/model.js
 * @Description:前端模型接口
 */
import request from 'framework/network/request'
// 获取模型列表
export const model_list = params => {
  return request({
    url: '/api/open/v1/model/models',
    method: 'GET',
    params
  })
}
export const model_upload = data => {
  return request({
    url: '/api/open/v1/model/upload',
    method: 'POST',
    data: data
  })
}

export const model_del = data => {
  return request({
    url: '/api/open/v1/model/delete',
    method: 'POST',
    data: data
  })
}
export const model_translation = data => {
  return request({
    url: '/api/open/v1/model/translation',
    method: 'POST',
    data: data
  })
}
export const model_detail = params => {
  return request({
    url: '/api/open/v1/model/model',
    method: 'GET',
    params
  })
}
export const model_cancel_translation = data => {
  return request({
    url: '/api/open/v1/model/cancel/translation',
    method: 'POST',
    data: data
  })
}

export const model_transform_detail = params => {
  return request({
    url: '/api/open/v1/model/transform/info',
    method: 'GET',
    params
  })
}

export const model_down = params => {
  return request({
    url: '/api/open/v1/model/download',
    method: 'GET',
    params,
    responseType: 'blob'
  })
}

export const model_status = params => {
  return request({
    url: '/api/open/v1/model/fs/status',
    method: 'GET',
    params
  })
}

export const model_attr = params => {
  return request({
    url: '/api/open/v1/model/ds/property',
    method: 'GET',
    params
  })
}
export const model_attr_query = params => {
  return request({
    url: '/api/open/v1/model/ds/property/query',
    method: 'GET',
    params
  })
}

export const model_tree_get = params => {
  return request({
    url: '/api/open/v1/model/fs/modeltree',
    method: 'GET',
    params
  })
}

export const model_tree_query = params => {
  return request({
    url: '/api/open/v1/model/fs/modeltree/query',
    method: 'GET',
    params
  })
}
export const model_view_token = data => {
  return request({
    url: '/api/open/v1/viewer/token',
    method: 'POST',
    data: data
  })
}
export const model_assembly = data => {
  return request({
    url: '/api/open/v1/model/assembly',
    method: 'POST',
    data: data
  })
}
export const model_assembly_edit = data => {
  return request({
    url: '/api/open/v1/model/assembly/edit',
    method: 'POST',
    data: data
  })
}

export const model_upload_tus = data => {
  return request({
    url: '/api/open/v1/model/model',
    method: 'POST',
    data: data
  })
}
