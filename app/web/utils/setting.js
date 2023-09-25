/**
 * @Date: 2023-06-06 11:04:15
 * @LastEditTime: 2023-09-18 17:31:19
 * @FilePath: /openapi-demoapp/app/web/utils/setting.js
 * @Description:
 */
const title = 'X-Base OpenApp'
export const getPageTitle = pageTitle => {
  if (pageTitle) {
    return `${title} - ${pageTitle}`
  }
  return `${title}`
}
export const viewerToken = token => {
  return `Bearer ${token}`
}
// 支持上传模型格式
export const fileModel = '.rvt,.ifc,.IFC,.dgn,.dwg,.skp,.obj,.stl,.fbx,.glb'
// 不支持瓦片数据格式
export const export_cim_data = '.dwg'
// 支持语义数据格式
export const export_bim_data = ''
// 支持上传资产格式
export const fileAsset = '.zip,.tiff,.tif'
