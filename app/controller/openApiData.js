/**
 * @Date: 2023-07-11 11:33:54
 * @LastEditTime: 2023-09-18 17:53:42
 * @FilePath: /openapi-demoapp/app/controller/openApiData.js
 * @Description:
 */
'use strict'
// const egg = require('egg')
const axios = require('axios')
const baseConfig = require('../service/baseConfig')
const Controller = require('./base-controller')
const path = require('path')
const fs = require('fs')
module.exports = class OpenApiDataController extends Controller {
  constructor(ctx) {
    super(ctx)
    this.ctx = ctx
  }
  template_download() {
    try {
      const filePath = path.join(this.app.config.baseDir, '/app/public', '模型分类编码模板.csv')
      this.ctx.set('Content-Type', 'application/octet-stream')
      this.ctx.body = fs.createReadStream(filePath)
    } catch (error) {
      this.ctx.body = this.error500(error)
    }
  }
  async standard_model_import(ctx) {
    this.ctx.body = await ctx.service.data.standard_model_import(ctx.request.files[0], { Authorization: ctx.cookies.get('token') }, ctx.request.body)
  }
  async check(ctx) {
    this.ctx.body = await ctx.service.data.check(ctx.request.query, { Authorization: ctx.cookies.get('token') })
  }
  async standard_model_list(ctx) {
    this.ctx.body = await ctx.service.data.standard_model_list(ctx.request.query, { Authorization: ctx.cookies.get('token') })
  }
  async standard_model_del(ctx) {
    this.ctx.body = await ctx.service.data.standard_model_del(ctx.request.body, { Authorization: ctx.cookies.get('token') })
  }
  async standard_model_edit(ctx) {
    this.ctx.body = await ctx.service.data.standard_model_edit(ctx.request.body, { Authorization: ctx.cookies.get('token') })
  }
  async standard_attr_list(ctx) {
    this.ctx.body = await ctx.service.data.standard_attr_list(ctx.request.query, { Authorization: ctx.cookies.get('token') })
  }
  async standard_attr_add(ctx) {
    this.ctx.body = await ctx.service.data.standard_attr_add(ctx.request.body, { Authorization: ctx.cookies.get('token') })
  }
  async standard_attr_copy(ctx) {
    this.ctx.body = await ctx.service.data.standard_attr_copy(ctx.request.body, { Authorization: ctx.cookies.get('token') })
  }
  async data_standard_attr_del(ctx) {
    this.ctx.body = await ctx.service.data.standard_attr_del(ctx.request.body, { Authorization: ctx.cookies.get('token') })
  }
  async data_standard_attr_edit(ctx) {
    this.ctx.body = await ctx.service.data.standard_attr_edit(ctx.request.body, { Authorization: ctx.cookies.get('token') })
  }
  async standard_attr_check(ctx) {
    this.ctx.body = await ctx.service.data.standard_attr_check(ctx.request.query, { Authorization: ctx.cookies.get('token') })
  }
  async model_child_list(ctx) {
    this.ctx.body = await ctx.service.data.model_child_list(ctx.request.body, { Authorization: ctx.cookies.get('token') })
  }
  async model_is_publish(ctx) {
    this.ctx.body = await ctx.service.data.model_is_publish(ctx.request.body, { Authorization: ctx.cookies.get('token') })
  }
  async model_publish(ctx) {
    this.ctx.body = await ctx.service.data.model_publish(ctx.request.body, { Authorization: ctx.cookies.get('token') })
  }
  async model_child_add(ctx) {
    this.ctx.body = await ctx.service.data.model_child_add(ctx.request.body, { Authorization: ctx.cookies.get('token') })
  }
  async model_child_edit(ctx) {
    this.ctx.body = await ctx.service.data.model_child_edit(ctx.request.body, { Authorization: ctx.cookies.get('token') })
  }
  async model_child_del(ctx) {
    this.ctx.body = await ctx.service.data.model_child_del(ctx.request.body, { Authorization: ctx.cookies.get('token') })
  }
  async model_child_move(ctx) {
    this.ctx.body = await ctx.service.data.model_child_move(ctx.request.body, { Authorization: ctx.cookies.get('token') })
  }
  async attr_child_check(ctx) {
    this.ctx.body = await ctx.service.data.attr_child_check(ctx.request.query, { Authorization: ctx.cookies.get('token') })
  }
  async attr_child_list(ctx) {
    this.ctx.body = await ctx.service.data.attr_child_list(ctx.request.query, { Authorization: ctx.cookies.get('token') })
  }
  async attr_child_add(ctx) {
    this.ctx.body = await ctx.service.data.attr_child_add(ctx.request.body, { Authorization: ctx.cookies.get('token') })
  }
  async attr_child_edit(ctx) {
    this.ctx.body = await ctx.service.data.attr_child_edit(ctx.request.body, { Authorization: ctx.cookies.get('token') })
  }
  async attr_child_del(ctx) {
    this.ctx.body = await ctx.service.data.attr_child_del(ctx.request.body, { Authorization: ctx.cookies.get('token') })
  }
  async attr_child_move(ctx) {
    this.ctx.body = await ctx.service.data.attr_child_move(ctx.request.body, { Authorization: ctx.cookies.get('token') })
  }
  // 构件映射规则
  async rule_model_components_list(ctx) {
    this.ctx.body = await ctx.service.rules.rule_model_components_list(ctx.request.query, { Authorization: ctx.cookies.get('token') })
  }
  async rule_components_add(ctx) {
    this.ctx.body = await ctx.service.rules.rule_components_add(ctx.request.body, { Authorization: ctx.cookies.get('token') })
  }
  async rule_components_edit(ctx) {
    this.ctx.body = await ctx.service.rules.rule_components_edit(ctx.request.body, { Authorization: ctx.cookies.get('token') })
  }
  async rule_model_components_del(ctx) {
    this.ctx.body = await ctx.service.rules.rule_model_components_del(ctx.request.body, { Authorization: ctx.cookies.get('token') })
  }
  async rule_components_reset(ctx) {
    this.ctx.body = await ctx.service.rules.rule_components_reset(ctx.request.body, { Authorization: ctx.cookies.get('token') })
  }
  async rule_components_move(ctx) {
    this.ctx.body = await ctx.service.rules.rule_components_move(ctx.request.body, { Authorization: ctx.cookies.get('token') })
  }
  async rule_components_check(ctx) {
    this.ctx.body = await ctx.service.rules.rule_components_check(ctx.request.query, { Authorization: ctx.cookies.get('token') })
  }
  // 标准映射规则
  async rule_standard_list(ctx) {
    this.ctx.body = await ctx.service.rules.rule_standard_list(ctx.request.query, { Authorization: ctx.cookies.get('token') })
  }
  async rule_standard_add(ctx) {
    this.ctx.body = await ctx.service.rules.rule_standard_add(ctx.request.body, { Authorization: ctx.cookies.get('token') })
  }
  async rule_standard_edit(ctx) {
    this.ctx.body = await ctx.service.rules.rule_standard_edit(ctx.request.body, { Authorization: ctx.cookies.get('token') })
  }
  async rule_standard_del(ctx) {
    this.ctx.body = await ctx.service.rules.rule_standard_del(ctx.request.body, { Authorization: ctx.cookies.get('token') })
  }
  async rule_standard_reset(ctx) {
    this.ctx.body = await ctx.service.rules.rule_standard_reset(ctx.request.body, { Authorization: ctx.cookies.get('token') })
  }
  async rule_standard_move(ctx) {
    this.ctx.body = await ctx.service.rules.rule_standard_move(ctx.request.body, { Authorization: ctx.cookies.get('token') })
  }
  async rule_standard_check(ctx) {
    this.ctx.body = await ctx.service.rules.rule_standard_check(ctx.request.query, { Authorization: ctx.cookies.get('token') })
  }
  // 标准映射
  async standard_map_list(ctx) {
    this.ctx.body = await ctx.service.standard.standard_map_list(ctx.request.query, { Authorization: ctx.cookies.get('token') })
  }
  async standard_map_add(ctx) {
    this.ctx.body = await ctx.service.standard.standard_map_add(ctx.request.body, { Authorization: ctx.cookies.get('token') })
  }
  async standard_map_edit(ctx) {
    this.ctx.body = await ctx.service.standard.standard_map_edit(ctx.request.body, { Authorization: ctx.cookies.get('token') })
  }
  async standard_map_del(ctx) {
    this.ctx.body = await ctx.service.standard.standard_map_del(ctx.request.body, { Authorization: ctx.cookies.get('token') })
  }
  async standard_map_check(ctx) {
    this.ctx.body = await ctx.service.standard.standard_map_check(ctx.request.query, { Authorization: ctx.cookies.get('token') })
  }
  async standard_publish_list(ctx) {
    this.ctx.body = await ctx.service.standard.standard_publish_list(ctx.request.query, { Authorization: ctx.cookies.get('token') })
  }
  async standard_map_auto_match(ctx) {
    this.ctx.body = await ctx.service.standard.standard_map_auto_match(ctx.request.body, { Authorization: ctx.cookies.get('token') })
  }
  async standard_publish_source_list(ctx) {
    this.ctx.body = await ctx.service.standard.standard_publish_source_list(ctx.request.query, { Authorization: ctx.cookies.get('token') })
  }
  async standard_publish_map_list(ctx) {
    this.ctx.body = await ctx.service.standard.standard_publish_map_list(ctx.request.query, { Authorization: ctx.cookies.get('token') })
  }
  async standard_map_match_bind(ctx) {
    this.ctx.body = await ctx.service.standard.standard_map_match_bind(ctx.request.body, { Authorization: ctx.cookies.get('token') })
  }
  async standard_map_match_unbind(ctx) {
    this.ctx.body = await ctx.service.standard.standard_map_match_unbind(ctx.request.body, { Authorization: ctx.cookies.get('token') })
  }
  async standard_publish_map_right_list(ctx) {
    this.ctx.body = await ctx.service.standard.standard_publish_map_right_list(ctx.request.query, { Authorization: ctx.cookies.get('token') })
  }
  async standard_model_components(ctx) {
    this.ctx.body = await ctx.service.standard.standard_model_components(ctx.request.query, { Authorization: ctx.cookies.get('token') })
  }
  async standard_model_processing_info(ctx) {
    this.ctx.body = await ctx.service.standard.standard_model_processing_info(ctx.request.body, { Authorization: ctx.cookies.get('token') })
  }
  async standard_model_autoMatch(ctx) {
    this.ctx.body = await ctx.service.standard.standard_model_autoMatch(ctx.request.body, { Authorization: ctx.cookies.get('token') })
  }
  async standard_model_bind_data(ctx) {
    this.ctx.body = await ctx.service.standard.standard_model_bind_data(ctx.request.body, { Authorization: ctx.cookies.get('token') })
  }
  async standard_model_unbind(ctx) {
    this.ctx.body = await ctx.service.standard.standard_model_unbind(ctx.request.body, { Authorization: ctx.cookies.get('token') })
  }
  async standard_model_bind(ctx) {
    this.ctx.body = await ctx.service.standard.standard_model_bind(ctx.request.body, { Authorization: ctx.cookies.get('token') })
  }

  async map_content_result(ctx) {
    this.ctx.body = await ctx.service.standard.map_content_result(ctx.request.query, { Authorization: ctx.cookies.get('token') })
  }
  async standard_model_bind_standard(ctx) {
    this.ctx.body = await ctx.service.standard.standard_model_bind_standard(ctx.request.body, { Authorization: ctx.cookies.get('token') })
  }
}
