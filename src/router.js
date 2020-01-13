import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

const router = new Router({
  base: '/DynamicCommonUI-Vue-MobilePart',
  routes: [
    {
      path: '/studyWords-setting',
      name: 'studyWords-setting',
      component: () => import(/* webpackChunkName: "about" */ '../src/views/mine/studyWords-setting.vue'),
      meta: {
        title: '学单词设置'
      }
    },
    {
      path: '/settings',
      name: 'settings',
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ '../src/views/mine/settings.vue'),
      meta: {
        // keepAlive: true,
        title: '学单词设置'
        // requireAuth: true // 当有这个字段的时候,我们就认为这个路由页面是要有登录权限的
      }
    },
    {
      path: '/',
      name: 'valculator',
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ '../src/views/herry-project/valculator.vue'),
      meta: {
        // keepAlive: true,
        title: '计算器'
        // requireAuth: true // 当有这个字段的时候,我们就认为这个路由页面是要有登录权限的
      }
    },
    {
      path: '/reply',
      name: 'reply',
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ '../src/views/herry-project/reply.vue'),
      meta: {
        // keepAlive: true,
        title: '编辑器'
        // requireAuth: true // 当有这个字段的时候,我们就认为这个路由页面是要有登录权限的
      }
    },
    {
      path: '/test',
      name: 'test',
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ '../src/views/herry-project/test.vue'),
      meta: {
        // keepAlive: true,
        title: 'test'
        // requireAuth: true // 当有这个字段的时候,我们就认为这个路由页面是要有登录权限的
      }
    }
  ]
})

export default router
