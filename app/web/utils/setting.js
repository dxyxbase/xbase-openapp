/**
 * @Date: 2023-06-06 11:04:15
 * @LastEditTime: 2023-06-25 09:58:03
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
