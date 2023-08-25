/**
 * @Date: 2023-06-06 18:44:22
 * @LastEditTime: 2023-06-16 11:12:22
 * @FilePath: /openapi-demoapp/app/web/apis/search.js
 * @Description:前端数据高级管理接口
 */
import request from 'framework/network/request'
export const search = data => {
  return request({
    url: '/api/open/v1/componentsearch/search',
    method: 'POST',
    data: data
  })
}

export const save_search_record = data => {
  return request({
    url: '/api/open/v1/componentsearch/add',
    method: 'POST',
    data: data
  })
}

export const search_record_list = params => {
    return request({
      url: '/api/open/v1/componentsearch/list',
      method: 'GET',
      params
    })
}

export const edit_search_record = data => {
  return request({
    url: '/api/open/v1/componentsearch/edit',
    method: 'POST',
    data: data
  })
}

export const search_model_list = params => {
    return request({
        url: '/api/open/v1/componentsearch/file/list',
        method: 'GET',
        params
    })
}

export const search_component_list = params => {
    return request({
        url: '/api/open/v1/componentsearch/component/list',
        method: 'GET',
        params
    })
}

export const record_output = data => {
    return request({
        url: '/api/open/v1/componentsearch/export',
        method: 'POST',
        data: data
    })
}

export const record_model_output = data => {
    return request({
        url: '/api/open/v1/componentsearch/file/export',
        method: 'POST',
        data: data
    })
}

export const search_record_delete = data => {
    return request({
        url: '/api/open/v1/componentsearch/delete',
        method: 'POST',
        data: data
    })
}

export const is_search = params => {
    return request({
        url: '/api/open/v1/componentsearch/search-state',
        method: 'GET',
        params
    })
}

export const search_cancel = data => {
    return request({
        url: '/api/open/v1/componentsearch/cancel',
        method: 'POST',
        data: data
    })
}

export const component_property = data => {
    return request({
        url: '/api/open/v1/componentset/property',
        method: 'POST',
        data: data
    })
}

export const component_category = data => {
    return request({
        url: '/api/open/v1/componentset/category',
        method: 'POST',
        data: data
    })
}
