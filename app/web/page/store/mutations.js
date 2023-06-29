/**
 * @Date: 2023-06-05 19:10:35
 * @LastEditTime: 2023-06-28 15:20:13
 * @FilePath: /openapi-demoapp/app/web/page/store/mutations.js
 * @Description:
 */
'use strict'

import storage from 'store'
import { SET_TOKEN } from './mutation-type'
import router from '@/page/router'
import Message from 'ant-design-vue/es/message'
const mutations = {
  [SET_TOKEN](state, data) {
    if (data.data.code * 1 === 0) {
      const res = data.data.data
      state.SET_TOKEN = res.token
      storage.set(SET_TOKEN, res.token)
      storage.set('username', res.userInfo.username)
      Message.success('登录成功')
      router.push('/')
    }
  }
}
export default mutations
