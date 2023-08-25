/**
 * @Date: 2023-07-17 10:21:42
 * @LastEditTime: 2023-07-21 13:32:44
 * @FilePath: /openapi-demoapp/app/web/apis/standard.js
 * @Description:
 */
import request from 'framework/network/request'
export const standard_map_list = params => {
  return request({
    url: '/api/open/v1/standardization/mapping',
    method: 'GET',
    params
  })
}
export const standard_map_add = data => {
  return request({
    url: '/api/open/v1/standardization/mapping',
    data: data,
    method: 'POST'
  })
}

export const standard_map_edit = data => {
  return request({
    url: '/api/open/v1/standardization/mapping/update',
    data: data,
    method: 'POST'
  })
}
export const standard_map_del = data => {
  return request({
    url: '/api/open/v1/standardization/mapping/delete',
    data: data,
    method: 'POST'
  })
}

export const standard_map_check = params => {
  return request({
    url: '/api/open/v1/standardization/mapping/check-name',
    method: 'GET',
    params
  })
}

export const standard_publish_list = params => {
  return request({
    url: '/api/open/v1/standardization/standard/publish',
    method: 'GET',
    params
  })
}
export const standard_map_auto_match = data => {
  return request({
    url: '/api/open/v1/standardization/mapping/auto-match',
    data: data,
    method: 'POST'
  })
}
export const standard_publish_source_list = params => {
  return request({
    url: '/api/open/v1/standardization/mapping/content/standard',
    method: 'GET',
    params
  })
}
export const standard_publish_map_list = params => {
  return request({
    url: '/api/open/v1/standardization/mapping/content/mapping/standard',
    method: 'GET',
    params
  })
}

export const standard_map_match_bind = data => {
  return request({
    url: '/api/open/v1/standardization/mapping/content/bind',
    data: data,
    method: 'POST'
  })
}
export const standard_map_match_unbind = data => {
  return request({
    url: '/api/open/v1/standardization/mapping/content/unbind',
    data: data,
    method: 'POST'
  })
}
export const standard_publish_map_right_list = params => {
  return request({
    url: '/api/open/v1/standardization/mapping/content',
    method: 'GET',
    params
  })
}
export const standard_model_components = params => {
  return request({
    url: '/api/open/v1/standardization/model/components',
    method: 'GET',
    params
  })
}

export const standard_model_processing_info = data => {
  return request({
    url: '/api/open/v1/standardization/model/processing-info',
    data: data,
    method: 'POST'
  })
}
export const standard_model_autoMatch = data => {
  return request({
    url: '/api/open/v1/standardization/model/auto-match',
    data: data,
    method: 'POST'
  })
}
export const standard_model_bind_data = data => {
  return request({
    url: '/api/open/v1/standardization/model/components/bind-data',
    data: data,
    method: 'POST'
  })
}
export const standard_model_unbind = data => {
  return request({
    url: '/api/open/v1/standardization/model/components/unbind',
    data: data,
    method: 'POST'
  })
}
export const standard_model_bind = data => {
  return request({
    url: '/api/open/v1/standardization/model/components/bind',
    data: data,
    method: 'POST'
  })
}

export const map_content_result = params => {
  return request({
    url: '/api/open/v1/standardization/mapping/content/result',
    method: 'GET',
    params
  })
}
export const standard_model_bind_standard = data => {
  return request({
    url: '/api/open/v1/standardization/model/bind-standard',
    data: data,
    method: 'POST'
  })
}
