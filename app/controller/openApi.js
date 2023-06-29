/**
 * @Date: 2023-06-07 21:19:27
 * @LastEditTime: 2023-06-29 13:48:09
 * @FilePath: /openapi-demoapp/app/controller/openApi.js
 * @Description:
 */
'use strict'
const egg = require('egg')
const axios = require('axios')
const baseConfig = require('../service/baseConfig')
const Controller = require('./base-controller')
module.exports = class openApiController extends Controller {
  constructor(ctx) {
    super(ctx)
    this.ctx = ctx
  }
  async home(ctx) {
    const url = ctx.url.replace(/\/main/, '')
    await ctx.renderClient('main.js', { ctx, url })
  }
  // token鉴权
  async getToken() {
    const { ctx, app } = this
    try {
        //TODO
        // 实现自己的真正身份鉴别
        // 请求X-Base OpenAPi获取token，注意应用Token不要暴露到浏览器端
      const data = await axios.post(`${baseConfig.url}/api/open/v1/auth/client/token`, {
        app_id: baseConfig.app_id,
        app_key: baseConfig.app_key
      })
      if (data.data.code === 0) {
        ctx.session.token = {
          authorization: `Bear ${data.data.data.token}`
        }
        ctx.session.authorization = data.data.data.token
        ctx.session.expires_in = data.data.data.expires_in
        this.ctx.logger.info(
          '登录成功：\n',
          {
            app_id: baseConfig.app_id,
            app_key: baseConfig.app_key
          },
          '\n返回token：\n',
          data.data
        )
        // TODO 
        //jwt token, 后续中间件校验，实际前端接触token为加密后token
        // this.ctx.logger.info(`实际密码：${data.data.data.token}`, `解密key：${app.config.jwt.secret}`)
        // const login = { username: 'test', token: data.data.data.token }
        // const token = app.jwt.sign(login, app.config.jwt.secret, { expiresIn: '7d' })
        this.ctx.body = this.success({
          // HACK
          /**
           * 此处token应为后端对信息进行jwt加密后暴露给客户端接口校验凭证
           * /app/middleware/auth.js中间件拦截客户端请求，对headers中的authorization进行解密
           * /app/router.js引入中间件使用app.jwt   auth对请求进行过滤
           */
          token: data.data.data.token,
          userInfo: {
            username: ctx.request.body.username,
            age: Math.floor(Math.random() * (28 - 16 + 1)) + 15,
            desc: '-'
          }
        })
      } else {
        this.ctx.logger.error('登录失败xxx：\n', data.data)
        this.ctx.body = data.data
      }
    } catch (error) {
      this.ctx.logger.error('登录失败----：\n', error)
      this.ctx.body = this.error500()
    }
  }
  // 模型列表
  async model_list(ctx) {
    this.ctx.body = await ctx.service.model.lists(ctx.request.query, ctx.request.headers)
  }
  // 模型上传
  async model_upload(ctx) {
    this.ctx.body = await ctx.service.model.upload_one(ctx.request.files[0], ctx.request.headers)
  }
  // 模型分片上传
  async model_upload_tus(ctx) {
    this.ctx.body = await ctx.service.model.upload_one_tus(ctx.request.body, ctx.request.headers)
  }
  // 删除模型
  async model_del(ctx) {
    this.ctx.body = await ctx.service.model.del(ctx.request.body, ctx.request.headers)
  }
  // 转换模型
  async model_translation(ctx) {
    this.ctx.body = await ctx.service.model.translation(ctx.request.body, ctx.request.headers)
  }
  // 终止转换模型
  async model_cancel_translation(ctx) {
    this.ctx.body = await ctx.service.model.cancel_translation(ctx.request.body, ctx.request.headers)
  }
  // 模型详情
  async model_detail(ctx) {
    this.ctx.body = await ctx.service.model.detail(ctx.request.query, ctx.request.headers)
  }
  // 模型详情
  async model_transform_detail(ctx) {
    this.ctx.body = await ctx.service.model.transform_detail(ctx.request.query, ctx.request.headers)
  }
  // 模型下载
  async model_down(ctx) {
    const result = await ctx.curl(`${baseConfig.url}/api/open/v1/model/download`, {
      streaming: true,
      data: ctx.request.query,
      headers: {
        Authorization: ctx.session.token.authorization
      }
    })
    ctx.set(result.headers)
    ctx.body = result.res
  }
  // 模型预览
  async model_view_token(ctx) {
    this.ctx.body = await ctx.service.model.view_token(ctx.request.body, ctx.request.headers)
  }
  // 模型状态
  async model_status(ctx) {
    this.ctx.body = await ctx.service.model.status(ctx.request.query, ctx.request.headers)
  }
  // 模型属性
  async model_attr(ctx) {
    this.ctx.body = await ctx.service.model.attr(ctx.request.query, ctx.request.headers)
  }
  // 模型装配
  async model_assembly(ctx) {
    this.ctx.body = await ctx.service.model.assembly(ctx.request.body, ctx.request.headers)
  }
  // 模型装配编辑
  async model_assembly_edit(ctx) {
    this.ctx.body = await ctx.service.model.assembly_edit(ctx.request.body, ctx.request.headers)
  }
  // 模型属性查找
  async model_attr_query(ctx) {
    this.ctx.body = await ctx.service.model.attr_query(ctx.request.query, ctx.request.headers)
  }
  // 模型构件树获取
  async model_tree_get(ctx) {
    this.ctx.body = await ctx.service.model.tree_get(ctx.request.query, ctx.request.headers)
  }
  // 模型构件树查找
  async model_tree_query(ctx) {
    this.ctx.body = await ctx.service.model.tree_query(ctx.request.query, ctx.request.headers)
  }
  // 资产列表
  async asset_list(ctx) {
    this.ctx.body = await ctx.service.asset.lists(ctx.request.query, ctx.request.headers)
  }
  // 资产上传
  async asset_upload(ctx) {
    this.ctx.body = await ctx.service.asset.upload_one(ctx.request.files[0], ctx.session.token, ctx.request.body)
  }
  // 资产分片上传
  async asset_upload_tus(ctx) {
    this.ctx.body = await ctx.service.asset.upload_one_tus(ctx.request.body, ctx.request.headers)
  }
  // 资产批量删除
  async asset_del(ctx) {
    this.ctx.body = await ctx.service.asset.del(ctx.request.body, ctx.request.headers)
  }
  // 资产详情
  async asset_detail(ctx) {
    this.ctx.body = await ctx.service.asset.detail(ctx.request.query, ctx.request.headers)
  }
  // 资产发起转换
  async asset_translation(ctx) {
    this.ctx.body = await ctx.service.asset.translation(ctx.request.body, ctx.request.headers)
  }
  // 资产终止转换
  async asset_translation_cancel(ctx) {
    this.ctx.body = await ctx.service.asset.translation_cancel(ctx.request.body, ctx.request.headers)
  }
  // 场景列表
  async scene_list(ctx) {
    this.ctx.body = await ctx.service.scene.lists(ctx.request.query, ctx.request.headers)
  }
  // 场景新增/编辑
  async scene_edit(ctx) {
    this.ctx.body = await ctx.service.scene.edit(ctx.request.body, ctx.request.headers)
  }
  // 校验场景名称
  async scene_check(ctx) {
    this.ctx.body = await ctx.service.scene.check(ctx.request.query, ctx.request.headers)
  }
  // 场景删除
  async scene_del(ctx) {
    this.ctx.body = await ctx.service.scene.del(ctx.request.body, ctx.request.headers)
  }
  // 场景重命名
  async scene_rename(ctx) {
    this.ctx.body = await ctx.service.scene.rename(ctx.request.body, ctx.request.headers)
  }

  // 场景详情
  async scene_detail(ctx) {
    this.ctx.body = await ctx.service.scene.detail(ctx.request.query, ctx.request.headers)
  }

  // 根据关键词联想搜索地址
  async searchLocation(ctx) {
    this.ctx.body = await ctx.service.scene.searchLocation(ctx.request.query, ctx.request.headers)
  }
  async scene_load_list(ctx) {
    this.ctx.body = await ctx.service.scene.load_list(ctx.request.headers)
  }

  // 视点新增
  async port_add(ctx) {
    this.ctx.body = await ctx.service.viewport.add(ctx.request.body, ctx.request.headers)
  }
  // 视点删除
  async port_del(ctx) {
    this.ctx.body = await ctx.service.viewport.del(ctx.request.body, ctx.request.headers)
  }
  // 视点列表
  async port_list(ctx) {
    this.ctx.body = await ctx.service.viewport.lists(ctx.request.query, ctx.request.headers)
  }
  // 视点详情
  async port_detail(ctx) {
    this.ctx.body = await ctx.service.viewport.detail(ctx.request.query, ctx.request.headers)
  }

  // 场景资产查询
  async scene_assets(ctx) {
    this.ctx.body = await ctx.service.scene.assets(ctx.request.headers)
  }

  async tus_upload(ctx) {
    this.ctx.logger.info(ctx.request.files[0], ctx.request.headers)
    this.ctx.body = ''
  }

  // 视点详情
  async query_uid(ctx) {
    this.ctx.body = await ctx.service.scene.query_uid(ctx.request.query, ctx.request.headers)
  }
}
