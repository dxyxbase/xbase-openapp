/**
 * @Date: 2023-06-05 15:42:27
 * @LastEditTime: 2023-06-28 14:58:12
 * @FilePath: /openapi-demoapp/app/web/page/index.js
 * @Description:
 */
import App from 'framework/app'
import createI18n from 'framework/i18n'
import createStore from './store'
import router from './router'
import index from './index.vue'
new App({ index, createI18n, router, createStore }).bootstrap()
