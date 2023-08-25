/**
 * @Date: 2023-06-06 18:44:22
 * @LastEditTime: 2023-08-22 18:42:27
 * @FilePath: /openapi-demoapp/app/web/apis/sence.js
 * @Description:前端场景接口
 */
import request from 'framework/network/request'
// 获取模型列表
export const sence_list = params => {
  return request({
    url: '/api/open/v1/scene/scenes',
    method: 'GET',
    params
  })
}
// 重名检查
export const sence_check = params => {
  return request({
    url: '/api/open/v1/scene/check-name',
    method: 'GET',
    params
  })
}
// 删除
export const sence_del = data => {
  return request({
    url: '/api/open/v1/scene/delete',
    method: 'POST',
    data: data
  })
}
// 改名
export const sence_rename = data => {
  return request({
    url: '/api/open/v1/scene/rename',
    method: 'POST',
    data: data
  })
}
// 详情
export const sence_detail = id => {
  return request({
    url: `/api/open/v1/scene/detail?scene_id=${id}`,
    method: 'GET'
    // params
  })
}
// 新增场景关联资产列表
export const sence_assets = () => {
  return request({
    url: '/api/open/v1/sence/assets',
    method: 'GET'
  })
}

// 新建 or 保存场景
export const sence_edit = data => {
  return request({
    url: '/api/open/v1/scene/scene',
    method: 'POST',
    data: data
  })
}
//模拟 模型编辑关联 资产 模型列表
export function load_list() {
  return request.get('/api/xbase/v1/scene/load-list')
}
export const searchLocation = data => {
  return request.get(`/api/open/v1/scene/locations?query=${data.query}&region=${data.region}&city_limit=false&output=json`)
}

// getTilesetJson
export const getTilesetJson = (url, headers) => {
  return request({
    url: `/viewer/model/${url}`,
    method: 'GET',
    headers
  })
}
export const query_uid = params => {
  return request({
    url: `/api/open/v1/model/ds/property/uid`,
    method: 'GET',
    params
  })
}

export const query_uid_byAsset = params => {
  return request({
    url: `/api/open/v1/asset/ds/property/uid`,
    method: 'GET',
    params
  })
}
export const getCimCategory = () => {
  return request({
    url: '/api/open/v1/graph-service/cim/category',
    method: 'GET'
  })
}
/**
 * 获取元素属性
 */

export function getElementSemanticProperty(id) {
  return request({
    url: `/api/open/v1/graph-service/cim?id=${id}`,
    method: 'GET'
  })
}

// 暂无
export function updateSemantic(params) {
  return request({
    url: '/api/xbase/v1/graph-service/cim/update',
    method: 'POST',
    data: params
  })
}

export function saveSemantic(params) {
  return request({
    url: '/api/open/v1/graph-service/cim/save',
    method: 'POST',
    data: params
  })
}

// 暂时未添加
export function deleteSemantic(params) {
  return request({
    url: '/api/open/v1/graph-service/cim/delete',
    method: 'POST',
    data: params
  })
}

export function getCimNodeSemantic(id) {
  return request({
    url: `/api/open/v1/graph-service/cim/nodes?scene_id=${id}&page_num=1&page_size=999`,
    method: 'GET'
  })
}
