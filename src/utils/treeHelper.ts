import { useIconRender } from '@/hooks/useIconRender';
import { RendererNode, RendererElement } from 'vue';

export interface MenuItem {
  title: string | undefined;
  path: string;
  icon: () => VNode<RendererNode, RendererElement, { [key: string]: any }>;
  children?: MenuItem[];
}

const { iconRender } = useIconRender();

// 清空tree数据中空的处理childNodes
export function clearTreeEmptyChild(tree: { [x: string]: any }[], key: string | number) {
  tree.forEach((item: { [x: string]: any }) => {
    if (item[key].length === 0) {
      delete item[key];
    } else {
      clearTreeEmptyChild(item[key], key);
    }
  });
  return tree;
}

// tree数据扁平化处理
export function treeToFlat(treeList: any[], flatList: any[], children: string | number) {
  treeList.map((item) => {
    flatList.push(item);
    if (item[children] && item[children].length > 0) {
      treeToFlat(item[children], flatList, children);
    }
  });
  return flatList;
}

// 生成菜单

export function transformRoutesToMenus(routes: AppRouteRecordRaw[]): MenuItem[] {
  const menus: MenuItem[] = [];
  routes.forEach((item) => {
    let menuItem: MenuItem = {
      title: item.meta?.title,
      path: item.path,
      icon: iconRender({ icon: item.meta?.icon as string })
    };

    if (item.children) {
      const childList = item.children.filter((item) => !item.meta?.hideInMenu);
      if (childList && childList.length === 1) {
        const menu = childList[0];
        menuItem = {
          title: menu.meta?.title,
          path: menu.path,
          icon: iconRender({ icon: menu.meta?.icon as string }),
          children: []
        };
      } else {
        menuItem.children = transformRoutesToMenus(childList);
      }
    }
    if (menuItem.children && menuItem.children.length === 0) {
      delete menuItem.children;
    }
    !item.meta?.hidden && menus.push(menuItem);
  });
  return menus;
}
