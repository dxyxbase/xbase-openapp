/**
 * @Date: 2023-07-11 11:33:54
 * @LastEditTime: 2023-07-11 11:35:11
 * @FilePath: /openapi-demoapp/app/controller/openApi_data.js
 * @Description:
 */
'use strict'
// const egg = require('egg')
const axios = require('axios')
const baseConfig = require('../service/baseConfig')
const Controller = require('./base-controller')
module.exports = class openApiClashController extends Controller {
  constructor(ctx) {
    super(ctx)
    this.ctx = ctx
  }

  async clash_del(ctx) {
    this.ctx.body = await ctx.service.clash.clash_del(ctx.request.body, { authorization: ctx.cookies.get('token') })
  }

  async clash_cancel(ctx) {
    this.ctx.body = await ctx.service.clash.clash_cancel(ctx.request.body, { authorization: ctx.cookies.get('token') })
  }

  async clash_create(ctx) {
    this.ctx.body = await ctx.service.clash.clash_create(ctx.request.body, { authorization: ctx.cookies.get('token') })
  }

  async clash_lists(ctx) {
    this.ctx.body = await ctx.service.clash.clash_lists(ctx.request.query, { authorization: ctx.cookies.get('token') })
  }

  async clash_content(ctx) {
    this.ctx.body = await ctx.service.clash.clash_content(ctx.request.query, { authorization: ctx.cookies.get('token') })
  }
}
