/**
 * @Date: 2023-06-25 16:01:18
 * @LastEditTime: 2023-06-27 15:11:14
 * @FilePath: /openapi-demoapp/app/web/page/store/index.js
 * @Description:
 */
'use strict'
import Vue from 'vue'
import Vuex from 'vuex'

import actions from './actions'
import getters from './getters'
import mutations from './mutations'

Vue.use(Vuex)

export default function createStore(initState) {
  const state = {
    SET_TOKEN: null,
    username: '',
    ...initState
  }
  return new Vuex.Store({
    state,
    actions,
    getters,
    mutations
  })
}
