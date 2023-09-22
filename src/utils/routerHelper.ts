const modules = import.meta.glob('../views/**/*.{vue,tsx}');

/* Layout */
export const Layout = () => import('@/layout/Layout.vue');

console.log('modules', modules);

export function getComponentName(url: string) {
  if (!url || !url.indexOf('/')) return url;
  const tem = url.split('/');
  const characters = [...tem[tem.length - 1]];
  characters[0] = characters[0].toUpperCase();
  return characters.join('');
}

export const getComponent = (item: Permission) => {
  const path = `../views/${item.url}.vue` || `../views/${item.url}.tsx`;
  console.log('path', path);
  if (item.type === 'F') return;
  if (item.type === 'M') return Layout;
  if (item.type === 'C') return modules[path];
};

// 路由生成器
export const routerGenerator = (routerMap: Permission[]): AppRouteRecordRaw[] => {
  return routerMap
    .filter((item) => item.type !== 'F')
    .map((item) => {
      const currentRouter: AppRouteRecordRaw = {
        path: `/${item.url}`,
        name: getComponentName(item.component),
        component: getComponent(item),
        meta: {
          type: item.type,
          title: item.name,
          icon: item.icon,
          activeMenu: `/${item.activeMenu}`,
          hidden: item.display === 1 ? false : true
        }
      };
      if (item.childNodes && item.childNodes.length > 0) {
        currentRouter.children = routerGenerator(item.childNodes);
      }

      return currentRouter;
    });
};
