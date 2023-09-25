import request from 'framework/network/request'
// 构件列表
export const model_components_list = params => {
  return request({
    url: '/api/open/v1/component/components',
    method: 'GET',
    params
  })
}
// 上传构件(非分片)
export const model_components_upload = data => {
  return request({
    url: '/api/open/v1/component/upload',
    method: 'POST',
    data: data
  })
}
// 保存构件
export const model_components_save = data => {
  return request({
    url: '/api/open/v1/component/component',
    method: 'POST',
    data: data
  })
}
// 构件详情
export const model_components_detail = params => {
  return request({
    url: '/api/open/v1/component/component',
    method: 'GET',
    params
  })
}
// 格式转换
export const model_components_transfer_start = data => {
  return request({
    url: '/api/open/v1/component/translation',
    method: 'POST',
    data: data
  })
}
// 终止格式转换
export const model_components_transfer_cancel = data => {
  return request({
    url: '/api/open/v1/component/cancel/translation',
    method: 'POST',
    data: data
  })
}
// 格式转换详情
export const model_components_info = params => {
  return request({
    url: '/api/open/v1/component/transform/info',
    method: 'GET',
    params
  })
}
// 构件删除
export const model_components_del = data => {
  return request({
    url: '/api/open/v1/component/delete',
    method: 'POST',
    data: data
  })
}