import {
  createRouter,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  // hash 模式
  // history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: () => import("../views/sd/api.vue"),
    },
    {
      path: "/:pathMatch(.*)", // 404页面
      component: () => import("@/views/components/404.vue"),
    },
  ],
});
// 动态添加路由
// router.addRoute({ path: "/test", component: () => import("../test.vue")});

export default router;
