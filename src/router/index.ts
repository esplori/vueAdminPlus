import { createRouter, createWebHistory,createWebHashHistory } from 'vue-router'

const router = createRouter({
  // history: createWebHistory(import.meta.env.BASE_URL),
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      component: () => import(/* webpackChunkName: "login" */ '../views/account/login.vue')
    },
    {
      path: '/reg',
      component: () => import(/* webpackChunkName: "reg" */ '../views/account/reg.vue')
    },
    {
      path: '/regActive',
      component: () => import(/* webpackChunkName: "regActive" */'../views/account/regActive.vue')
    },
    {
      path: '/',
      name: 'mainLayout',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/HomeView.vue'),
      children: [
        {
          path: "",
          redirect: "home"
        },
        {
          path: 'home',
          component: () => import('../views/workbench/home.vue')
        },
        {
          path: 'pageList',
          component: () => import(/* webpackChunkName: "pageList" */'../views/postManage/pageList.vue')
        },
        {
          path: 'post',
          component: () => import(/* webpackChunkName: "post" */'../views/postManage/post.vue')
        },
        {
          path: 'edit',
          component: () => import(/* webpackChunkName: "post" */'../views/postManage/post.vue')
        },
        {
          path: 'cateList',
          component: () => import(/* webpackChunkName: "cateList" */'../views/postManage/cateList.vue')
        },
        {
          path: 'topic',
          component: () => import(/* webpackChunkName: "topic" */'../views/postManage/topic.vue')
        },
        {
          path: 'topicManage',
          component: () => import(/* webpackChunkName: "cateList" */'../views/postManage/topicManage.vue')
        },
        {
          path: 'systemSetting',
          component: () => import(/* webpackChunkName: "systemSetting" */'../views/setting/systemSetting.vue')
        },
        {
          path: 'mail',
          component: () => import(/* webpackChunkName: "mail" */'../views/setting/sendMail.vue')
        },
        {
          path: 'recycle',
          component: () => import(/* webpackChunkName: "recycle" */'../views/setting/recyclePost.vue')
        },
        {
          path: 'userSetting',
          component: () => import(/* webpackChunkName: "userSetting" */'../views/setting/userSetting.vue')
        },
        {
          path: 'deploy',
          component: () => import(/* webpackChunkName: "deploy" */'../views/setting/deploy.vue')
        },
        {
          path: 'navigationList',
          component: () => import(/* webpackChunkName: "navigationList" */'../views/navigationManage/navigationList.vue')
        },
        {
          path: 'navigationCate',
          component: () => import(/* webpackChunkName: "navigationCate" */'../views/navigationManage/navigationCate.vue')
        },
        {
          path: 'navigationEdit',
          component: () => import(/* webpackChunkName: "navigationEdit" */'../views/navigationManage/navigationEdit.vue')
        },
        {
          path: 'sourceList',
          component: () => import(/* webpackChunkName: "sourceList" */'../views/setting/sourceList.vue')
        },
        {
          path: 'caiji',
          component: () => import(/* webpackChunkName: "caiji" */'../views/caiji/caiji.vue')
        },
        {
          path: 'caijiList',
          component: () => import(/* webpackChunkName: "caijiList" */'../views/caiji/caijiList.vue')
        },
        {
          path: 'tbkType',
          component: () => import(/* webpackChunkName: "caijiList" */'../views/caiji/tbkCate.vue')
        },
        {
          path: 'userManage',
          component: () => import(/* webpackChunkName: "userManage" */'../views/userManage/userManage.vue')
        },
        {
          path: 'roleManage',
          component: () => import(/* webpackChunkName: "roleManage" */'../views/userManage/roleManage.vue')
        },
        {
          path: 'menuManage',
          component: () => import(/* webpackChunkName: "roleManage" */'../views/userManage/menuManage.vue')
        },
        {
          path: 'commentList',
          component: () => import(/* webpackChunkName: "comments" */'../views/postManage/commentList.vue')
        },
        {
          path: 'tools',
          component: () => import(/* webpackChunkName: "tools" */'../views/tools/index.vue'),
          children: [
            {
              path: 'qrcode',
              component: () => import(/* webpackChunkName: "qrcode" */'../views/tools/qrcode/index.vue')
            },
            {
              path: 'dianming',
              component: () => import(/* webpackChunkName: "dianming" */'../views/tools/dianming/dianming.vue')
            },
            {
              path: 'img2base64',
              component: () => import(/* webpackChunkName: "img2base64" */'../views/tools/img2base64/img2base64.vue')
            },
            {
              path: 'jsonviewer',
              component: () => import(/* webpackChunkName: "jsonviewer" */'../views/tools/jsonviewer/jsonviewer.vue')
            },
            {
              path: 'choujiang',
              component: () => import(/* webpackChunkName: "choujiang" */'../views/tools/choujiang/choujiang.vue')
            },
          ]
        }
      ]
    }
  ]
})

export default router
