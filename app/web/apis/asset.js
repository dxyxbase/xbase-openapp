/**
 * @Date: 2023-06-07 10:27:09
 * @LastEditTime: 2023-06-16 11:43:46
 * @FilePath: /openapi-demoapp/app/web/apis/asset.js
 * @Description:前端资产接口
 */
import request from 'framework/network/request'
export const asset_list = params => {
  return request({
    url: '/api/open/v1/asset/assets',
    method: 'GET',
    params
  })
}
export const asset_upload = data => {
  return request({
    url: '/api/open/v1/asset/upload',
    method: 'POST',
    data: data
  })
}
export const asset_del = data => {
  return request({
    url: '/api/open/v1/asset/delete',
    method: 'POST',
    data: data
  })
}
export const asset_detail = params => {
  return request({
    url: '/api/open/v1/asset/detail',
    method: 'GET',
    params
  })
}

export const asset_translation = data => {
  return request({
    url: '/api/open/v1/asset/translation',
    method: 'POST',
    data: data
  })
}
export const asset_translation_cancel = data => {
  return request({
    url: '/api/open/v1/asset/translation/cancel',
    method: 'POST',
    data: data
  })
}

export const asset_upload_tus = data => {
  return request({
    url: '/api/open/v1/asset/asset',
    method: 'POST',
    data: data
  })
}
// export const tus_upload = data => {
//   return request({
//     url: '/api/open/v1/tus/upload',
//     method: 'POST',
//     data: data
//   })
// }
