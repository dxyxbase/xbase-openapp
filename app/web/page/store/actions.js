/**
 * @Date: 2023-06-05 19:10:35
 * @LastEditTime: 2023-06-28 15:23:24
 * @FilePath: /openapi-demoapp/app/web/page/store/actions.js
 * @Description:
 */
'use strict'
import * as Type from './mutation-type'
import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

const actions = {
  SET_TOKEN: (store, userInfo) => {
    const { username, password } = userInfo
    return axios.post('/api/v1/login', { username: username.trim(), password: password }).then(res => {
      store.commit(Type.SET_TOKEN, res)
    })
  }
}

export default actions
