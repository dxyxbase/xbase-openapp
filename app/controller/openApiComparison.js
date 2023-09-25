/**
 * @Date: 2023-07-11 11:33:54
 * @LastEditTime: 2023-07-11 11:35:11
 * @FilePath: /openapi-demoapp/app/controller/openApi_comparison.js
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

  async comparison_del(ctx) {
    this.ctx.body = await ctx.service.comparison.comparison_del(ctx.request.body, { authorization: ctx.cookies.get('token') })
  }

  async comparison_cancel(ctx) {
    this.ctx.body = await ctx.service.comparison.comparison_cancel(ctx.request.body, { authorization: ctx.cookies.get('token') })
  }

  async comparison_export(ctx) {
    this.ctx.body = await ctx.service.comparison.comparison_export(ctx.request.body, { authorization: ctx.cookies.get('token') })
  }

  async comparison_create(ctx) {
    this.ctx.body = await ctx.service.comparison.comparison_create(ctx.request.body, { authorization: ctx.cookies.get('token') })
  }

  async comparison_lists(ctx) {
    this.ctx.body = await ctx.service.comparison.comparison_lists(ctx.request.query, { authorization: ctx.cookies.get('token') })
  }

  async comparison_content(ctx) {
    this.ctx.body = await ctx.service.comparison.comparison_content(ctx.request.query, { authorization: ctx.cookies.get('token') })
  }

  async comparison_content_property(ctx) {
    this.ctx.body = await ctx.service.comparison.comparison_content_property(ctx.request.query, { authorization: ctx.cookies.get('token') })
  }
}
