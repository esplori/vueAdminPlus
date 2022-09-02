import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'mainLayout',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/HomeView.vue'),
      children:[
        {
          path: 'login',
          component: () => import('../views/account/login.vue'),
        },
        {
          path: 'home',
          component: () => import('../views/workbench/home.vue'),
        }
      ]
    }
  ]
})

export default router
