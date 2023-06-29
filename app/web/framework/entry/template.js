/**
 * @Date: 2023-06-25 16:01:18
 * @LastEditTime: 2023-06-29 11:32:17
 * @FilePath: /openapi-demoapp/app/web/framework/entry/template.js
 * @Description:
 */
import Layout from 'component/layout/index'
// import plugin from 'framework/plugin';

export default function (Vue) {
  // Vue.use(plugin);
  Vue.component(Layout.name, Layout)
}
