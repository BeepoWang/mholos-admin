import { App } from 'vue';
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { createRouteGuards } from './routerGuards';
import { Layout } from '../utils/routerHelper';
import { useI18n } from '@/hooks/useI18n';

const { t } = useI18n();

export const constantRouter: AppRouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: Layout,
    meta: {
      hidden: true
    },
    children: [
      {
        path: '/404',
        name: '404',
        component: () => import('@/views/error/404.vue'),
        meta: {
          hidden: true,
          title: '404'
        }
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/Login.vue'),
    name: 'Login',
    meta: {
      hidden: true,
      title: t('router.login'),
      noTagsView: true
    }
  },
  {
    name: 'Error',
    path: '/error',
    component: Layout,
    redirect: '/error/404',
    meta: {
      hidden: true,
      title: '错误页面',
      alwaysShow: true
    },
    children: [
      {
        path: '404',
        component: () => import('@/views/error/404.vue'),
        name: '404Demo',
        meta: {
          hidden: true,
          title: '404'
        }
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_PUBLIC_PATH),
  routes: constantRouter as RouteRecordRaw[],
  scrollBehavior: () => ({ left: 0, top: 0 })
});

export const setupRouter = (app: App) => {
  app.use(router);
  createRouteGuards(router);
};
