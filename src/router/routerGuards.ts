import { useNProgress } from '@/hooks/useNProgress';
import { usePageLoading } from '@/hooks/usePageLoading';
import { useTitle } from '@/hooks/useTitle';
import { useAuthStoreWithOut } from '@/store/modules/auth';
import { usePermissionStoreWithOut } from '@/store/modules/permission';
import type { RouteRecordRaw, Router } from 'vue-router';

const { start, done } = useNProgress();
const { loadStart, loadDone } = usePageLoading();

const authStore = useAuthStoreWithOut();
const permissionStore = usePermissionStoreWithOut();

const whiteList = ['/login', '/404'];

export const createRouteGuards = (router: Router) => {
  router.beforeEach(async (to, from, next) => {
    start();
    loadStart();
    // 白名单路由直接跳转
    if (whiteList.includes(to.path)) {
      if (to.path === '/login') {
        next();
        return;
      } else {
        next();
        return;
      }
    }

    // 校验token
    if (!authStore.getToken) {
      next('/login');
      return;
    }

    // 判断是否已经添加过路由
    if (permissionStore.getIsAddRouters) {
      next();
      return;
    }

    const userDetail = await authStore.getUserDetail();
    console.log('router guard ==>', userDetail);
    permissionStore.generatorRouter(userDetail);
    permissionStore.getAddRouters.forEach((route) => {
      router.addRoute(route as unknown as RouteRecordRaw);
    });
    const redirectPath = from.query.redirect || to.path;
    const redirect = decodeURIComponent(redirectPath as string);
    const nextData = to.path === redirect ? { ...to, replace: true } : { path: redirect };
    permissionStore.setIsAddRouters(true);
    next(nextData);
  });

  router.afterEach((to) => {
    useTitle(to?.meta?.title as string);
    done();
    loadDone();
  });

  router.onError((error) => {
    console.log(`路由错误 => ${error}`);
  });
};
