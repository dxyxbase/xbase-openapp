/**
 * @Date: 2023-06-06 17:53:29
 * @LastEditTime: 2023-07-12 09:49:33
 * @FilePath: /openapi-demoapp/app/web/utils/common.js
 * @Description:
 */
// 下载文件
export function noop() {}
export function convertRes2Blob(response, item) {
  const name = item.name
  // let str = response.headers['content-disposition'].match(/filename\*=UTF-8''(.*)/)[1]
  const blob = new Blob([response], { type: 'application/octet-stream' })
  if (typeof window.navigator.msSaveBlob !== 'undefined') {
    window.navigator.msSaveBlob(blob, decodeURI(name))
  } else {
    const blobURL = window.URL.createObjectURL(blob)
    const tempLink = document.createElement('a')
    tempLink.style.display = 'none'
    tempLink.href = blobURL
    tempLink.setAttribute('download', decodeURI(name))
    if (typeof tempLink.download === 'undefined') {
      tempLink.setAttribute('target', '_blank')
    }
    document.body.appendChild(tempLink)
    tempLink.click()
    document.body.removeChild(tempLink)
    window.URL.revokeObjectURL(blobURL)
  }
}
export function queryURL(name) {
  const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, 'i')
  const r = window.location.search.substr(1).match(reg)
  if (r != null) return decodeURI(r[2])
  return null
}

export const standardStatu = {
  '-1': '处理失败',
  1: '处理中',
  2: '可发布',
  3: '已发布',
  4: '存档'
}
