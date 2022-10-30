import {
  createRouter,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";

const router = createRouter({
  // history: createWebHistory(import.meta.env.BASE_URL),
  // hash 模式
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/login",
      component: () => import("../views/account/login.vue"),
    },
    {
      path: "/reg",
      component: () => import("../views/account/reg.vue"),
    },
    {
      path: "/regActive",
      component: () => import("../views/account/regActive.vue"),
    },
    {
      path: "/",
      name: "mainLayout",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/HomeView.vue"),
      children: [
        {
          path: "",
          redirect: "home",
        },
        {
          path: "home",
          component: () => import("../views/workbench/home.vue"),
        },
        {
          path: "navigation",
          children: [
            {
              path: "list",
              component: () =>
                import("../views/navigationManage/navigationList.vue"),
            },
            {
              path: "cateManage",
              component: () =>
                import("../views/navigationManage/navigationCate.vue"),
            },
            {
              path: "post",
              component: () =>
                import("../views/navigationManage/navigationEdit.vue"),
            },
          ]
        },
        {
          path: "article",
          children: [
            {
              path: "pageList",
              component: () => import("../views/postManage/pageList.vue"),
            },
            {
              path: "post",
              component: () => import("../views/postManage/post.vue"),
            },
            {
              path: "cateManage",
              component: () => import("../views/postManage/cateList.vue"),
            },
            {
              path: "topic",
              component: () => import("../views/postManage/topic.vue"),
            },
            {
              path: "topicManage",
              component: () => import("../views/postManage/topicManage.vue"),
            },
            {
              path: "commentManage",
              component: () => import("../views/postManage/commentList.vue"),
            },
          ]
        },
        {
          path: "tools",
          component: () => import("../views/tools/index.vue"),
          children: [
            {
              path: "ebook",
              component: () => import("../views/tools/ebook/index.vue"),
            },
            {
              path: "ebookDetail",
              component: () => import("../views/tools/ebook/detail.vue"),
            },
            {
              path: "getRegionFromIp",
              component: () => import("../views/tools/getRegionFromIp/index.vue"),
            },
            {
              path: "qrcode",
              component: () => import("../views/tools/qrcode/index.vue"),
            },
            {
              path: "dianming",
              component: () => import("../views/tools/dianming/dianming.vue"),
            },
            {
              path: "img2base64",
              component: () =>
                import("../views/tools/img2base64/img2base64.vue"),
            },
            {
              path: "jsonviewer",
              component: () =>
                import("../views/tools/jsonviewer/jsonviewer.vue"),
            },
            {
              path: "choujiang",
              component: () => import("../views/tools/choujiang/choujiang.vue"),
            },
          ],
        },
        {
          path: "authority",
          children: [
            {
              path: "userManage",
              component: () => import("../views/userManage/userManage.vue"),
            },
            {
              path: "roleManage",
              component: () => import("../views/userManage/roleManage.vue"),
            },
            {
              path: "menuManage",
              component: () => import("../views/userManage/menuManage.vue"),
            },
          ]
        },
        {
          path: "user",
          children: [
            {
              path: "userSetting",
              component: () => import("../views/setting/userSetting.vue"),
            },
          ]
        },
        {
          path: "promotion",
          component: () => import("../views/caiji/index.vue"),
          children: [
            {
              path: "/",
              redirect: "caiji",
            },
            {
              path: "caiji",
              component: () => import("../views/caiji/caiji.vue"),
            },
            {
              path: "caijiList",
              component: () => import("../views/caiji/caijiList.vue"),
            },
            {
              path: "type",
              component: () => import("../views/caiji/tbkCate.vue"),
            },
          ]
        },
        {
          path: "system",
          children: [
            {
              path: "setting",
              component: () => import("../views/setting/systemSetting.vue"),
            },
            {
              path: "sendMail",
              component: () => import("../views/setting/sendMail.vue"),
            },
            {
              path: "recycle",
              component: () => import("../views/setting/recyclePost.vue"),
            },

            {
              path: "deploy",
              component: () => import("../views/setting/deploy.vue"),
            },
            {
              path: "sourceList",
              component: () => import("../views/setting/sourceList.vue"),
            },
            {
              path: "notice",
              component: () => import("../views/setting/notice.vue"),
            },
          ]
        },
      ],
    },
    {
      path: "/:pathMatch(.*)", // 404页面
      component: () => import("@/views/components/404.vue"),
    },
  ],
});

export default router;
