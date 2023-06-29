/**
 * @Date: 2023-06-13 09:51:34
 * @LastEditTime: 2023-06-19 13:59:53
 * @FilePath: /openapi-demoapp/app/service/viewport.js
 * @Description:
 */
'use strict'
const egg = require('egg')
const axios = require('axios')
const baseConfig = require('./baseConfig')
module.exports = class PortService extends egg.Service {
  constructor(ctx) {
    super(ctx)
    this.ctx = ctx
  }
  async lists(query, header) {
    const data = await axios.get(`${baseConfig.url}/api/open/v1/viewport/viewports`, {
      params: query,
      headers: {
        Authorization: header.authorization
      }
    })
    return data.data
  }
  async detail(query, header) {
    const data = await axios.get(`${baseConfig.url}/api/open/v1/viewport/viewport`, {
      params: query,
      headers: {
        Authorization: header.authorization
      }
    })
    return data.data
  }
  async add(body, header) {
    const data = await axios.post(`${baseConfig.url}/api/open/v1/viewport/add`, body, {
      headers: {
        Authorization: header.authorization,
        contentType: 'application/json'
      }
    })
    return data.data
  }
  async del(body, header) {
    const data = await axios.post(`${baseConfig.url}/api/open/v1/viewport/delete`, body, {
      headers: {
        Authorization: header.authorization,
        contentType: 'application/json'
      }
    })
    return data.data
  }
}
