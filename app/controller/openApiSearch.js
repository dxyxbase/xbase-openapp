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

  async search(ctx) {
    this.ctx.body = await ctx.service.search.search(ctx.request.body, { authorization: ctx.cookies.get('token') })
  }

  async save_search_record(ctx) {
    this.ctx.body = await ctx.service.search.save_search_record(ctx.request.body, { authorization: ctx.cookies.get('token') })
  }

  async edit_search_record(ctx) {
    this.ctx.body = await ctx.service.search.edit_search_record(ctx.request.body, { authorization: ctx.cookies.get('token') })
  }

  async search_record_list(ctx) {
    this.ctx.body = await ctx.service.search.search_record_list(ctx.request.query, { authorization: ctx.cookies.get('token') })
  }

  async search_model_list(ctx) {
    this.ctx.body = await ctx.service.search.search_model_list(ctx.request.query, { authorization: ctx.cookies.get('token') })
  }
  async search_component_list(ctx) {
    this.ctx.body = await ctx.service.search.search_component_list(ctx.request.query, { authorization: ctx.cookies.get('token') })
  }

  async record_output(ctx) {
    this.ctx.body = await ctx.service.search.record_output(ctx.request.body, { authorization: ctx.cookies.get('token') })
  }

  async record_model_output(ctx) {
    this.ctx.body = await ctx.service.search.record_model_output(ctx.request.body, { authorization: ctx.cookies.get('token') })
  }

  async search_record_delete(ctx) {
    this.ctx.body = await ctx.service.search.search_record_delete(ctx.request.body, { authorization: ctx.cookies.get('token') })
  }

  async is_search(ctx) {
    this.ctx.body = await ctx.service.search.is_search(ctx.request.query, { authorization: ctx.cookies.get('token') })
  }

  async search_cancel(ctx) {
    this.ctx.body = await ctx.service.search.search_cancel(ctx.request.body, { authorization: ctx.cookies.get('token') })
  }

  async component_property(ctx) {
    this.ctx.body = await ctx.service.search.component_property(ctx.request.body, { authorization: ctx.cookies.get('token') })
  }

  async component_category(ctx) {
    this.ctx.body = await ctx.service.search.component_category(ctx.request.body, { authorization: ctx.cookies.get('token') })
  }
}
