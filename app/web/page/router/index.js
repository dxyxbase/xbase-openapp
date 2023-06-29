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
            title: '模型列表'
          },
          component: () => import('@/page/view/ModelView/list.vue')
        }
      ]
    },

    {
      path: '/assetView',
      name: 'assetView',
      meta: {
        title: '资产管理'
      },
      redirect: '/asset-list',
      component: () => import('@/page/view/AssetView/index.vue'),
      children: [
        {
          path: '/asset-list',
          name: 'assetList',
          meta: {
            title: '资产列表'
          },
          component: () => import('@/page/view/AssetView/list.vue')
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
            title: '场景列表'
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
