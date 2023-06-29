/**
 * @Date: 2023-06-05 19:10:35
 * @LastEditTime: 2023-06-28 15:00:52
 * @FilePath: /openapi-demoapp/app/web/framework/app.js
 * @Description:
 */
import Vue from 'vue'
import { sync } from 'vuex-router-sync'
import * as setting from '@/utils/setting.js'
export default class App {
  constructor(config) {
    this.config = config
  }

  bootstrap() {
    const options = this.create(window.__INITIAL_STATE__)
    const app = new Vue(options)
    app.$mount('#app')
  }

  fetch(store, router) {
    const matchedComponents = router.getMatchedComponents()
    if (!matchedComponents) {
      return Promise.reject('No Match Component')
    }
    return Promise.all(
      matchedComponents.map(component => {
        if (component.methods && component.methods.fetchApi) {
          return component.methods.fetchApi.call(component, { $store: store, $router: router })
        }
        return null
      })
    )
  }
  create(initState) {
    const { index, options, createStore, router } = this.config
    const store = createStore(initState)
    router.beforeEach((to, from, next) => {
      document.title = setting.getPageTitle(to.meta.title)
      next()
    })
    router.afterEach(() => {
      this.fetch(store, router)
    })
    sync(store, router)
    return {
      ...index,
      ...options,
      router,
      store
    }
  }
}
