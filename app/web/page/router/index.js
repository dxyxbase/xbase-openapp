import Vue from 'vue'

import VueRouter from 'vue-router'
Vue.use(VueRouter)
// 路由重复点击问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
const router = new VueRouter({
  // mode: 'history',
  // base: '/admin/',
  routes: [
    {
      path: '/',
      name: 'modelView',
      meta: {
        title: '模型管理'
      },
      redirect: '/model-list',
      component: () => import('@/page/view/ModelView/index.vue'),
      children: [
        {
          path: '/model-list',
          name: 'modelList',
          meta: {
            title: '模型管理'
          },
          component: () => import('@/page/view/ModelView/list.vue')
        }
      ]
    },

    {
      path: '/component',
      name: 'componentView',
      meta: {
        title: '构件管理'
      },
      redirect: '/component-list',
      component: () => import('@/page/view/ComponentrManage/index.vue'),
      children: [
        {
          path: '/component-list',
          name: 'modelList',
          meta: {
            title: '构件管理'
          },
          component: () => import('@/page/view/ComponentrManage/list.vue')
        }
      ]
    },
    {
      path: '/assetView',
      name: 'assetView',
      meta: {
        title: '资产管理'
      },
      redirect: '/gis-asset-list',
      component: () => import('@/page/view/AssetView/index.vue'),
      children: [
        {
          path: '/gis-asset-list',
          name: 'assetList',
          meta: {
            title: 'GIS资产'
          },
          component: () => import('@/page/view/AssetView/list.vue')
        },
        {
          path: '/bim-asset-list',
          name: 'assetList',
          meta: {
            title: 'BIM资产'
          },
          component: () => import('@/page/view/AssetView/BIMList.vue')
        }
      ]
    },
    {
      path: '/sceneView',
      name: 'sceneView',
      meta: {
        title: '场景管理'
      },
      redirect: '/scene-list',
      component: () => import('@/page/view/SceneView/index.vue'),
      children: [
        {
          path: '/scene-list',
          name: 'sceneList',
          meta: {
            title: '场景管理'
          },
          component: () => import('@/page/view/SceneView/list.vue')
        },
        {
          path: '/scene-edit',
          name: 'sceneEdit',
          hidden: true,
          meta: {
            title: '场景编辑',
            activeMenu: '/scene-list'
          },
          component: () => import('@/page/view/SceneView/sceneEditor')
        }
      ]
    },
    {
      path: '/SemanticModel',
      name: 'SemanticModelView',
      meta: {
        title: '语义模型'
      },
      redirect: '/SemanticModel-list',
      component: () => import('@/page/view/SemanticModel/index.vue'),
      children: [
        {
          path: '/SemanticModel-list',
          name: 'modelList',
          meta: {
            title: '语义模型'
          },
          component: () => import('@/page/view/SemanticModel/list.vue')
        }
      ]
    },
    // 碰撞检查
    {
      path: '/clashView',
      name: 'clashView',
      meta: {
        title: '碰撞检查'
      },
      redirect: '/clash-list',
      component: () => import('@/page/view/CrashView/index.vue'),
      children: [
        {
          path: '/clash-list',
          name: 'clashList',
          meta: {
            title: '碰撞检查'
          },
          component: () => import('@/page/view/CrashView/list.vue')
        }
      ]
    },
    // 高级搜索
    {
      path: '/dataSearch',
      name: 'dataSearch',
      meta: {
        title: '数据高级管理'
      },
      redirect: '/dataSearch-list',
      component: () => import('@/page/view/DataSearch/index.vue'),
      children: [
        {
          path: '/dataSearch-list',
          name: 'dataSearchList',
          meta: {
            title: '数据高级管理',
            keepAlive: true
          },
          component: () => import('@/page/view/DataSearch/list.vue')
        }
      ]
    },

    // 模型对比
    {
      path: '/modelComparison',
      name: 'modelComparison',
      meta: {
        title: '模型对比'
      },
      redirect: '/modelComparison-list',
      component: () => import('@/page/view/modelComparison/index.vue'),
      children: [
        {
          path: '/modelComparison-list',
          name: 'modelComparisonList',
          meta: {
            title: '模型对比',
            keepAlive: true
          },
          component: () => import('@/page/view/modelComparison/list.vue'),
        }
      ]
    },

    // 数据标准化
    {
      path: '/data-standard',
      name: 'dataStandard',
      meta: {
        title: '数据标准化'
      },
      component: () => import('@/page/view/DataServer/index.vue'),
      children: [
        {
          path: 'manage',
          name: 'DataStandardManage',
          meta: {
            title: '数据标准管理'
          },
          component: () => import('@/page/view/DataServer/DataStandardManage/index.vue'),
          children: [
            {
              path: 'model-class',
              name: 'DataStandardManageModelClass',
              meta: {
                title: '模型分类标准'
              },
              component: () => import('@/page/view/DataServer/DataStandardManage/ModelClass/index.vue')
            },
            {
              path: 'model-class/:name/:standard_id/:version_id',
              name: 'DataStandardManageModelClassInfo',
              hidden: true,
              meta: {
                title: '模型分类标准详情',
                activeMenu: '/data-standard/manage/model-class'
              },
              component: () => import('@/page/view/DataServer/DataStandardManage/ModelClass/modelInfo.vue')
            },
            {
              path: 'attr-info',
              name: 'DataStandardManageAttrInfo',
              meta: {
                title: '属性信息标准'
              },
              component: () => import('@/page/view/DataServer/DataStandardManage/AttrInfo/index.vue')
            },
            {
              path: 'attr-class/:name/:standard_id',
              name: 'DataStandardManageAttrClassInfo',
              hidden: true,
              meta: {
                title: '属性详情',
                activeMenu: '/data-standard/manage/attr-info'
              },
              component: () => import('@/page/view/DataServer/DataStandardManage/AttrInfo/attrInfo.vue')
            }
          ]
        },
        {
          path: 'map-rules',
          name: 'MappingRulesManage',
          meta: {
            title: '映射规则管理'
          },
          component: () => import('@/page/view/DataServer/MappingRulesManage/index.vue'),
          children: [
            {
              path: 'standard-rule',
              name: 'MappingRulesManageStandardRule',
              meta: {
                title: '标准映射规则'
              },
              component: () => import('@/page/view/DataServer/MappingRulesManage/StandardRule/index.vue')
            },
            {
              path: 'component-rule',
              name: 'MappingRulesManageMembertRule',
              meta: {
                title: '构件映射规则'
              },
              component: () => import('@/page/view/DataServer/MappingRulesManage/MembertRule/index.vue')
            }
          ]
        },
        {
          path: 'map-manage',
          name: 'StandardMapManage',
          meta: {
            title: '标准映射管理'
          },
          component: () => import('@/page/view/DataServer/StandardMapManage/index.vue'),
          children: [
            {
              path: 'index',
              name: 'StandardMapManageList',
              meta: {
                title: '标准映射管理'
              },
              component: () => import('@/page/view/DataServer/StandardMapManage/list.vue')
            },
            {
              path: 'handle',
              name: 'StandardMapManageHandle',
              meta: {
                title: '手动映射',
                activeMenu: '/data-standard/map-manage/index'
              },
              hidden: true,
              component: () => import('@/page/view/DataServer/StandardMapManage/handleMap.vue')
            }
          ]
        },

        {
          path: 'standard-model',
          name: 'DataModel',
          meta: {
            title: '模型标准化'
          },
          component: () => import('@/page/view/DataServer/DataModelList/index.vue'),
          children: [
            {
              path: 'index',
              name: 'DataModelList',
              meta: {
                title: '模型标准化'
              },
              component: () => import('@/page/view/DataServer/DataModelList/list.vue')
            },
            {
              path: 'member',
              name: 'DataModelMember',
              hidden: true,
              meta: {
                title: '构件分类',
                activeMenu: '/data-standard/standard-model/index'
              },
              component: () => import('@/page/view/DataServer/DataModelList/member.vue')
            },
            {
              path: 'member-item',
              name: 'DataModelMemberItem',
              hidden: true,
              meta: {
                title: '构件',
                activeMenu: '/data-standard/standard-model/index'
              },
              component: () => import('@/page/view/DataServer/DataModelList/memberItem.vue')
            }
          ]
        }
      ]
    },
    // 模型检查
    // {
    //   path: '/data-modelCheck',
    //   name: 'modelCheck',
    //   meta: {
    //     title: '模型检查服务'
    //   },
    //   component: () => import('@/page/view/modelCheck/index.vue'),
    //   children: [
    //     {
    //       path: 'edit',
    //       name: 'editSnl',
    //       meta: {
    //         title: '规则编辑'
    //       },
    //       redirect: '/snl-list',
    //       component: () => import('@/page/view/modelCheck/editSnl/index.vue'),
    //       children: [
    //         {
    //           path: 'snl-list',
    //           name: 'SnlList',
    //           meta: {
    //             title: '规则编辑'
    //           },
    //           component: () => import('@/page/view/modelCheck/editSnl/list.vue'),
    //         },
    //         {
    //           path: '/new-snl',
    //           name: '/editSnl',
    //           hidden: true,
    //           meta: {
    //             title: '规则编辑'
    //           },
    //           component: () => import('@/page/view/modelCheck/editSnl/components/editSnl.vue'),
    //         }
    //       ]
    //     }
    //   ]
    // },
    {
      path: '/login',
      name: 'login',
      hidden: true,
      meta: {
        title: '登录'
      },
      component: () => import('@/page/view/Login/index.vue')
    },
    {
      path: '*',
      component: () => import('@/page/view/404.vue')
    }
  ]
})

export default router
