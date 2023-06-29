# X-Base 微服务示例

## 简介

[X-Base 平台](https://xbase.daxiangyun.com)是一个助力广大应用开发用户开发数字孪生领域应用的应用开发平台。X-Base 以微服务的形式提供了数字孪生应用中的核心能力 API。本项目是基于 X-Base 开放 API 开发的示例应用，您可以直接直接基于此项目体验 X-Base 平台 API 功能，也可以将此项目集成到您的业务系统中。

本项目实现了 BIM 模型和普通三维模型的上传，转换和预览；GIS 影像，地形数据的上传，转换和预览；CIM 场景的创建，BIM 数据的加载，预览和 GIS 数据分析等。 本项目支持 X-Base 平台支持的所有模型格式。

X-Base 平台支持用户上传 BIM 模型数据，包括 Revit, Bentley Microstation，SketchUp，Naviswork 等软件生产的 BIM 三维模型，也能支持 IFC，FBX，GLTF/GLB，OBJ，STL 等格式的三维模型。 X-Base 平台也支持用户上传 dwg/dxf 等二维格式的数据。

> 注意
> 使用本项目之前，请先参考[X-Base 文档中心](https://xbase.daxiangyun.com/doc/api)

## 如何使用

1. 创建和激活 X-Base 平台应用，获取应用的 `App ID`和 `App Key`
2. 修改项目配置文件 `xbase-config.json`
3. 运行项目

## 项目结构

```
+ xbase-openappp
  + app                       //后端代码
    + controller              //控制层,实现后端接口
    + middleware              //中间件，包括鉴权等
    + service                 //服务层，实现X-Base API的代理
    + view                    //视图层，egg框架保留
    + web                     //前端vue代码
    + router.js               //后端路由
  + config                    //egg框架配置文件
  + logs                      //日志目录
  + public                    //前端静态资源
  + xbase-config.json         //X-Base服务接口url以及app_id、app_key配置json
```

## X-Base 服务配置

启动项目之前需要为项目配置 X-Base 服务信息，修改项目根目录下 `xbase-config.json`文件，配置内容如下：

```
{
  "url": "https://xbase.daxiangyun.com",
  "app_id": "",
  "app_key": ""
}
```

> 说明：

- url: xbase 服务地址，私有化部署的情况下，修改为私有化部署地址
- app_id: 应用 ID
- app_key: 应用密钥，登录 X-Base 平台控制台，在应用详情页面可以获取，请妥善保管

> 如何获取 `app_id`和 `app_key`请参考[大象云的文档中心中的[入门指南][使用流程]](https://xbase.daxiangyun.com/doc/api)

## 如何运行

### 技术栈

本项目基于 NodeJS 集成了前后端的代码实现：

后端：代理 X-Base 开放 API，方便前端调用

- [nodejs](https://nodejs.org/)
- [eggjs](https://www.eggjs.org/zh-CN)

前端：实现模型，资产，场景的上传和预览

- [Vue2.5](https://v2.cn.vuejs.org/v2/guide/)
- [Ant Design Vue](https://www.antdv.com/components/overview)

### 安装依赖

> 注意: Node 版本 > V14.x

```
npm install  --legacy-peer-deps

#如果有网络问题使用国内源：
npm run ii
```

### 本地运行

打开 cmd，切换到项目根目录

```bash
# node版本16.X运行
npm run dev
# nodejs版本大于17.X运行
npm run dev1
```

等待编译完成，访问地址: http://127.0.0.1:7001/

### 打包部署

在生产环境部署运行时，需要先编译好前端代码，然后再打包：

```bash
npm run build
```

打包如下目录和文件：

- app（服务文件）
- config（项目配置项）
- public（前端打包内容）
- app.js
- packge.json
- README.md

生产环境部署后运行：

```bash
 npm install --production
 npm start
```

生产环境部署启动后，访问地址：http://127.0.0.1:7001/
