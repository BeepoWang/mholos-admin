import { routerGenerator } from '@/utils/routerHelper';
import { store } from '../index';
import { cloneDeep } from 'lodash-es';
import { constantRouter } from '@/router';

interface PermissionState {
  isAddRouters: boolean;
  routers: AppRouteRecordRaw[];
  addRouters: AppRouteRecordRaw[];
  menuTabRouters: AppRouteRecordRaw[];
}

export const usePermissionStore = defineStore('Permission', {
  state: (): PermissionState => {
    return {
      routers: [],
      addRouters: [],
      menuTabRouters: [],
      isAddRouters: false
    };
  },
  getters: {
    getRouters(): AppRouteRecordRaw[] {
      return this.routers;
    },
    getAddRouters(): AppRouteRecordRaw[] {
      return this.addRouters;
    },
    getIsAddRouters(): boolean {
      return this.isAddRouters;
    }
  },
  actions: {
    setIsAddRouters(isAddRouters: boolean) {
      this.isAddRouters = isAddRouters;
    },
    generatorRouter(data: UserInfo) {
      const routerMap = routerGenerator(data.rolePermissionList.permissions);
      this.addRouters = routerMap.concat([
        {
          path: '/:path(.*)*',
          name: '404Page',
          redirect: '/404',
          meta: {
            hidden: true
          }
        }
      ]);
      this.routers = cloneDeep(constantRouter).concat(routerMap);
    },
    setMenuTabRouters(routers: AppRouteRecordRaw[]): void {
      this.menuTabRouters = routers;
    }
  }
});

export const usePermissionStoreWithOut = () => {
  return usePermissionStore(store);
};
