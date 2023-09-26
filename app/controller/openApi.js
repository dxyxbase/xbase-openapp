/**
 * @Date: 2023-06-07 21:19:27
 * @LastEditTime: 2023-09-19 15:28:25
 * @FilePath: /openapi-demoapp/app/controller/openApi.js
 * @Description:
 */
'use strict'
// const egg = require('egg')
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
  //应用TokenAPI： https://xbasedev.dxbim.com:8333/doc/api#/services/token/apidocs/apptoken
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
        ctx.cookies.set('token', `Bearer ${data.data.data.token}`, {
          maxAge: 1000 * 3600 * 24 * 7
          // encrypt: true // 加密传输
        })
        this.ctx.logger.info(
          '登录成功：\n',
          {
            app_id: baseConfig.app_id,
            app_key: baseConfig.app_key
          },
          '\n返回token：\n',
          data.data
        )
        const userInfo = {
          username: ctx.request.body.username || 'Open API',
          age: Math.floor(Math.random() * (28 - 16 + 1)) + 15,
          desc: '[X-Base 平台]是一个助力广大应用开发用户开发数字孪生领域应用的应用开发平台。X-Base 以微服务的形式提供了数字孪生应用中的核心能力API',
          apiurl: 'https://xbase.daxiangyun.com/doc/api'
        }
        // TODO
        //jwt token, 后续中间件校验，实际前端接触token为加密后token
        const myToken = app.jwt.sign(userInfo, app.config.jwt.secret, { expiresIn: '7d' })
        this.ctx.body = this.success({
          // HACK
          /**
           * 此处token应为后端对信息进行jwt加密后暴露给客户端接口校验凭证
           * /app/middleware/auth.js中间件拦截客户端请求，对headers中的Authorization进行解密
           * /app/router.js引入中间件使用app.jwt   auth对请求进行过滤
           */
          token: myToken,
          userInfo: userInfo
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
    this.ctx.body = await ctx.service.model.lists(ctx.request.query, { Authorization: ctx.cookies.get('token') })
  }
  // 模型上传
  async model_upload(ctx) {
    this.ctx.body = await ctx.service.model.upload_one(ctx.request.files[0], {
      Authorization: ctx.cookies.get('token')
    })
  }
  // 模型分片上传
  // async model_upload_tus(ctx) {
  //   this.ctx.body = await ctx.service.model.upload_one_tus(ctx.request.body, {Authorization:ctx.cookie.get('token')})
  // }
  // 删除模型
  async model_del(ctx) {
    this.ctx.body = await ctx.service.model.del(ctx.request.body, { Authorization: ctx.cookies.get('token') })
  }
  // 转换模型
  async model_translation(ctx) {
    this.ctx.body = await ctx.service.model.translation(ctx.request.body, { Authorization: ctx.cookies.get('token') })
  }
  // 终止转换模型
  async model_cancel_translation(ctx) {
    this.ctx.body = await ctx.service.model.cancel_translation(ctx.request.body, {
      Authorization: ctx.cookies.get('token')
    })
  }
  // 模型详情
  async model_detail(ctx) {
    this.ctx.body = await ctx.service.model.detail(ctx.request.query, { Authorization: ctx.cookies.get('token') })
  }
  // 模型详情
  async model_transform_detail(ctx) {
    this.ctx.body = await ctx.service.model.transform_detail(ctx.request.query, {
      Authorization: ctx.cookies.get('token')
    })
  }
  // 模型下载
  async model_down(ctx) {
    const result = await ctx.curl(`${baseConfig.url}/api/open/v1/model/download`, {
      streaming: true,
      data: ctx.request.query,
      headers: {
        Authorization: ctx.cookies.get('token')
      }
    })
    ctx.set(result.headers)
    ctx.body = result.res
  }
  // 模型预览
  async view_token(ctx) {
    this.ctx.body = await ctx.service.model.view_token(ctx.request.body, { Authorization: ctx.cookies.get('token') })
  }
  // 模型属性
  async model_attr(ctx) {
    this.ctx.body = await ctx.service.model.attr(ctx.request.query, { Authorization: ctx.cookies.get('token') })
  }
  // 模型装配
  async model_assembly(ctx) {
    this.ctx.body = await ctx.service.model.assembly(ctx.request.body, { Authorization: ctx.cookies.get('token') })
  }
  // 模型装配编辑
  async model_assembly_edit(ctx) {
    this.ctx.body = await ctx.service.model.assembly_edit(ctx.request.body, { Authorization: ctx.cookies.get('token') })
  }
  // 模型属性查找
  async model_attr_query(ctx) {
    this.ctx.body = await ctx.service.model.attr_query(ctx.request.query, { Authorization: ctx.cookies.get('token') })
  }
  // 模型构件树获取
  async model_tree_get(ctx) {
    this.ctx.body = await ctx.service.model.tree_get(ctx.request.query, { Authorization: ctx.cookies.get('token') })
  }
  // 模型构件树查找
  async model_tree_query(ctx) {
    this.ctx.body = await ctx.service.model.tree_query(ctx.request.query, { Authorization: ctx.cookies.get('token') })
  }
  // 资产列表
  async asset_list(ctx) {
    this.ctx.body = await ctx.service.asset.lists(ctx.request.query, { Authorization: ctx.cookies.get('token') })
  }
  // 资产上传
  async asset_upload(ctx) {
    this.ctx.body = await ctx.service.asset.upload_one(
      ctx.request.files[0],
      { Authorization: ctx.cookies.get('token') },
      ctx.request.body
    )
  }
  //新建资产
  async asset_upload_tus(ctx) {
    this.ctx.body = await ctx.service.asset.upload_one_tus(ctx.request.body, {
      Authorization: ctx.cookies.get('token')
    })
  }
  // 资产批量删除
  async asset_del(ctx) {
    this.ctx.body = await ctx.service.asset.del(ctx.request.body, { Authorization: ctx.cookies.get('token') })
  }
  // 资产详情
  async asset_detail(ctx) {
    this.ctx.body = await ctx.service.asset.detail(ctx.request.query, { Authorization: ctx.cookies.get('token') })
  }
  // 资产发起转换
  async asset_translation(ctx) {
    this.ctx.body = await ctx.service.asset.translation(ctx.request.body, { Authorization: ctx.cookies.get('token') })
  }
  // 资产终止转换
  async asset_translation_cancel(ctx) {
    this.ctx.body = await ctx.service.asset.translation_cancel(ctx.request.body, {
      Authorization: ctx.cookies.get('token')
    })
  }
  // 场景列表
  async scene_list(ctx) {
    this.ctx.body = await ctx.service.scene.lists(ctx.request.query, { Authorization: ctx.cookies.get('token') })
  }
  // 场景新增/编辑
  async scene_edit(ctx) {
    this.ctx.body = await ctx.service.scene.edit(ctx.request.body, { Authorization: ctx.cookies.get('token') })
  }
  // 校验场景名称
  async scene_check(ctx) {
    this.ctx.body = await ctx.service.scene.check(ctx.request.query, { Authorization: ctx.cookies.get('token') })
  }
  // 场景删除
  async scene_del(ctx) {
    this.ctx.body = await ctx.service.scene.del(ctx.request.body, { Authorization: ctx.cookies.get('token') })
  }
  // 场景重命名
  async scene_rename(ctx) {
    this.ctx.body = await ctx.service.scene.rename(ctx.request.body, { Authorization: ctx.cookies.get('token') })
  }

  // 场景详情
  async scene_detail(ctx) {
    this.ctx.body = await ctx.service.scene.detail(ctx.request.query, { Authorization: ctx.cookies.get('token') })
  }

  // 根据关键词联想搜索地址
  async searchLocation(ctx) {
    this.ctx.body = await ctx.service.scene.searchLocation(ctx.request.query, {
      Authorization: ctx.cookies.get('token')
    })
  }
  async scene_load_list(ctx) {
    this.ctx.body = await ctx.service.scene.load_list({ Authorization: ctx.cookies.get('token') })
  }

  // 视点新增
  async port_add(ctx) {
    this.ctx.body = await ctx.service.viewport.add(ctx.request.body, { Authorization: ctx.cookies.get('token') })
  }
  // 视点删除
  async port_del(ctx) {
    this.ctx.body = await ctx.service.viewport.del(ctx.request.body, { Authorization: ctx.cookies.get('token') })
  }
  // 视点列表
  async port_list(ctx) {
    this.ctx.body = await ctx.service.viewport.lists(ctx.request.query, { Authorization: ctx.cookies.get('token') })
  }
  // 视点详情
  async port_detail(ctx) {
    this.ctx.body = await ctx.service.viewport.detail(ctx.request.query, { Authorization: ctx.cookies.get('token') })
  }

  // 场景资产查询
  async scene_assets(ctx) {
    this.ctx.body = await ctx.service.scene.assets({ Authorization: ctx.cookies.get('token') })
  }

  async tus_upload(ctx) {
    this.ctx.logger.info(ctx.request.files[0], { Authorization: ctx.cookies.get('token') })
    this.ctx.body = ''
  }
  // 属性查询
  async query_uid(ctx) {
    this.ctx.body = await ctx.service.scene.query_uid(ctx.request.query, { Authorization: ctx.cookies.get('token') })
  }
  // 资产id查询属性
  async query_uid_byAsset(ctx) {
    this.ctx.body = await ctx.service.scene.query_uid_byAsset(ctx.request.query, {
      Authorization: ctx.cookies.get('token')
    })
  }
  // 资产装配
  async asset_assembly(ctx) {
    this.ctx.body = await ctx.service.asset.asset_assembly(ctx.request.body, {
      Authorization: ctx.cookies.get('token')
    })
  }
  // 查询装配资产关联资产
  async getAsset_by_asm(ctx) {
    this.ctx.body = await ctx.service.asset.getAsset_by_asm(ctx.request.body, {
      Authorization: ctx.cookies.get('token')
    })
  }
  // 查询资产关联的装配
  async getAsm_by_asset(ctx) {
    this.ctx.body = await ctx.service.asset.getAsm_by_asset(ctx.request.body, {
      Authorization: ctx.cookies.get('token')
    })
  }

  async getCimCategory(ctx) {
    this.ctx.body = await ctx.service.scene.getCimCategory(ctx.request.query, {
      Authorization: ctx.cookies.get('token')
    })
  }

  async updateSemantic(ctx) {
    this.ctx.body = await ctx.service.scene.updateSemantic(ctx.request.body, {
      Authorization: ctx.cookies.get('token')
    })
  }
  async saveSemantic(ctx) {
    this.ctx.body = await ctx.service.scene.saveSemantic(ctx.request.body, { Authorization: ctx.cookies.get('token') })
  }

  async getElementSemanticProperty(ctx) {
    this.ctx.body = await ctx.service.scene.getElementSemanticProperty(ctx.request.query, {
      Authorization: ctx.cookies.get('token')
    })
  }

  async deleteSemantic(ctx) {
    this.ctx.body = await ctx.service.scene.deleteSemantic(ctx.request.body, {
      Authorization: ctx.cookies.get('token')
    })
  }

  async getCimNodeSemantic(ctx) {
    this.ctx.body = await ctx.service.scene.getCimNodeSemantic(ctx.request.query, {
      Authorization: ctx.cookies.get('token')
    })
  }
  // 构件
  async model_components_list(ctx) {
    this.ctx.body = await ctx.service.modelComponents.model_components_list(ctx.request.query, {
      Authorization: ctx.cookies.get('token')
    })
  }
  async model_components_detail(ctx) {
    this.ctx.body = await ctx.service.modelComponents.model_components_detail(ctx.request.query, {
      Authorization: ctx.cookies.get('token')
    })
  }
  async model_components_save(ctx) {
    this.ctx.body = await ctx.service.modelComponents.model_components_save(ctx.request.body, {
      Authorization: ctx.cookies.get('token')
    })
  }
  async model_components_transfer_start(ctx) {
    this.ctx.body = await ctx.service.modelComponents.model_components_transfer_start(ctx.request.body, {
      Authorization: ctx.cookies.get('token')
    })
  }
  async model_components_transfer_cancel(ctx) {
    this.ctx.body = await ctx.service.modelComponents.model_components_transfer_cancel(ctx.request.body, {
      Authorization: ctx.cookies.get('token')
    })
  }
  async model_components_info(ctx) {
    this.ctx.body = await ctx.service.modelComponents.model_components_info(ctx.request.query, {
      Authorization: ctx.cookies.get('token')
    })
  }
  async model_components_del(ctx) {
    this.ctx.body = await ctx.service.modelComponents.model_components_del(ctx.request.body, {
      Authorization: ctx.cookies.get('token')
    })
  }
  // 模型上传
  async model_components_upload(ctx) {
    this.ctx.body = await ctx.service.modelComponents.model_components_upload(ctx.request.files[0], {
      Authorization: ctx.cookies.get('token')
    })
  }

  // 语义模型列表
  async semantic_model_list(ctx) {
    this.ctx.body = await ctx.service.model.semantic_model_list(ctx.request.query, {
      Authorization: ctx.cookies.get('token')
    })
  }
  
  // 转换语义模型列表
  async trans_semantic_model_list(ctx) {
    this.ctx.body = await ctx.service.model.trans_semantic_model_list(ctx.request.query, {
      Authorization: ctx.cookies.get('token')
    })
  }

  async semantic_model_add(ctx) {
    this.ctx.body = await ctx.service.model.semantic_model_add(ctx.request.body, {
      Authorization: ctx.cookies.get('token')
    })
  }
  async semantic_model_transfrom(ctx) {
    this.ctx.body = await ctx.service.model.semantic_model_transfrom(ctx.request.body, {
      Authorization: ctx.cookies.get('token')
    })
  }
  async semantic_model_transfromCancel(ctx) {
    this.ctx.body = await ctx.service.model.semantic_model_transfromCancel(ctx.request.body, {
      Authorization: ctx.cookies.get('token')
    })
  }
  async semantic_model_info(ctx) {
    this.ctx.body = await ctx.service.model.semantic_model_info(ctx.request.query, {
      Authorization: ctx.cookies.get('token')
    })
  }
  async semantic_model_infoTrans(ctx) {
    this.ctx.body = await ctx.service.model.semantic_model_infoTrans(ctx.request.query, {
      Authorization: ctx.cookies.get('token')
    })
  }
  async semantic_model_del(ctx) {
    this.ctx.body = await ctx.service.model.semantic_model_del(ctx.request.body, {
      Authorization: ctx.cookies.get('token')
    })
  }
}
