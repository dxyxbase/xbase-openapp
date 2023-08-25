/**
 * @Date: 2023-07-13 13:46:31
 * @LastEditTime: 2023-07-17 10:21:57
 * @FilePath: /openapi-demoapp/app/web/apis/rules.js
 * @Description:
 */
import request from 'framework/network/request'
export const rule_member_list = params => {
  return request({
    url: '/api/open/v1/standardization/rule/component',
    method: 'GET',
    params
  })
}
export const rule_member_add = data => {
  return request({
    url: '/api/open/v1/standardization/rule/component',
    data: data,
    method: 'POST'
  })
}
export const rule_member_edit = data => {
  return request({
    url: '/api/open/v1/standardization/rule/component/update',
    data: data,
    method: 'POST'
  })
}
export const rule_member_del = data => {
  return request({
    url: '/api/open/v1/standardization/rule/component/delete',
    data: data,
    method: 'POST'
  })
}
export const rule_member_reset = data => {
  return request({
    url: '/api/open/v1/standardization/rule/component/reset',
    data: data,
    method: 'POST'
  })
}
export const rule_member_move = data => {
  return request({
    url: '/api/open/v1/standardization/rule/component/move',
    data: data,
    method: 'POST'
  })
}

export const rule_standard_list = params => {
  return request({
    url: '/api/open/v1/standardization/rule/standard',
    method: 'GET',
    params
  })
}
export const rule_standard_add = data => {
  return request({
    url: '/api/open/v1/standardization/rule/standard',
    data: data,
    method: 'POST'
  })
}
export const rule_standard_edit = data => {
  return request({
    url: '/api/open/v1/standardization/rule/standard/update',
    data: data,
    method: 'POST'
  })
}
export const rule_standard_del = data => {
  return request({
    url: '/api/open/v1/standardization/rule/standard/delete',
    data: data,
    method: 'POST'
  })
}
export const rule_standard_reset = data => {
  return request({
    url: '/api/open/v1/standardization/rule/standard/reset',
    data: data,
    method: 'POST'
  })
}
export const rule_standard_move = data => {
  return request({
    url: '/api/open/v1/standardization/rule/standard/move',
    data: data,
    method: 'POST'
  })
}
export const rule_standard_check = params => {
  return request({
    url: '/api/open/v1/standardization/rule/standard/check-exist',
    method: 'GET',
    params
  })
}
export const rule_member_check = params => {
  return request({
    url: '/api/open/v1/standardization/rule/component/check-exist',
    method: 'GET',
    params
  })
}
