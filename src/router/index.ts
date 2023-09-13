import { App } from 'vue';
import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';

const constantRouter: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/home/home.vue'),
    meta: {
      title: '首页'
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/login.vue')
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRouter,
  scrollBehavior: () => ({ left: 0, top: 0 })
});

export const setupRouter = (app: App) => {
  app.use(router);
};
