import { routerGenerator } from '@/utils/routerHelper';
import { store } from '../index';
import { cloneDeep } from 'lodash-es';
import { constantRouter } from '@/router';
import { MenuItem, transformRoutesToMenus, treeToFlat } from '@/utils/treeHelper';

interface PermissionState {
  isAddRouters: boolean;
  routers: AppRouteRecordRaw[];
  addRouters: AppRouteRecordRaw[];
  buttonPermissions: Permission[];
  menus: MenuItem[];
  menuTabRouters: AppRouteRecordRaw[];
}

export const usePermissionStore = defineStore('Permission', {
  state: (): PermissionState => {
    return {
      routers: [],
      addRouters: [],
      menuTabRouters: [],
      buttonPermissions: [],
      menus: [],
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
    },
    getMenus(): MenuItem[] {
      return this.menus;
    },
    getButtonPermission(): Permission[] {
      return this.buttonPermissions;
    },
    getMenuTabRouters(): AppRouteRecordRaw[] {
      return this.menuTabRouters;
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
      this.generatorMenu(this.routers);
      this.generatorButtonPermission(data.rolePermissionList.permissions);
    },
    generatorMenu(router: AppRouteRecordRaw[]) {
      const menus = transformRoutesToMenus(router);
      this.menus = menus;
    },
    generatorButtonPermission(permissions: Permission[]) {
      const flatList = treeToFlat(permissions, [], 'childNodes');
      this.buttonPermissions = flatList.filter((item) => item.type === 'F');
    },
    setMenuTabRouters(routers: AppRouteRecordRaw[]): void {
      this.menuTabRouters = routers;
    }
  }
});

export const usePermissionStoreWithOut = () => {
  return usePermissionStore(store);
};
