import { isUrl } from '@/utils/is';
import { pathResolve } from '@/utils/routerHelper';
import { ElMenuItem, ElSubMenu } from 'element-plus';
// import { hasOneChildShow } from "../helper"
import { useRenderMenuTitle } from './useRenderMenuTitle';
import { hasOneChildShow } from '../helper';

const { renderMenuTitle } = useRenderMenuTitle();

export const useRenderMenuItem = (menuMode: 'vertical' | 'horizontal') => {
  const renderMenuItem = (menuList: AppRouteRecordRaw[], parentPath = '/') => {
    return menuList.map((item) => {
      // console.log('menuList', item)
      // const fullPath = isUrl(item.path) ? item.path : pathResolve(parentPath, item.path)
      // if (item.children && item.children.length > 1) {
      //   return (
      //     <ElSubMenu index={item.path}>
      //       {{
      //         title: () => renderMenuTitle(item.meta),
      //         default: () => renderMenuItem(item.children as AppRouteRecordRaw[], fullPath)
      //       }}
      //     </ElSubMenu>
      //   )
      // } else {
      //   return (
      //     <ElMenuItem index={item.path}>
      //       {{
      //         default: () => renderMenuTitle(item.meta)
      //       }}
      //     </ElMenuItem>
      //   )
      // }
      const meta = item.meta ?? {};
      if (!meta.hidden) {
        const { oneShowChild, onlyOneChild } = hasOneChildShow(item.children, item);
        const fullPath = isUrl(item.path) ? item.path : pathResolve(parentPath, item.path);
        if (
          oneShowChild &&
          (!onlyOneChild?.children || onlyOneChild?.noShowingChildren) &&
          !meta.alwaysShow
        ) {
          return (
            <ElMenuItem index={onlyOneChild ? pathResolve(fullPath, onlyOneChild.path) : fullPath}>
              {{
                default: () => renderMenuTitle(onlyOneChild ? onlyOneChild.meta : meta)
              }}
            </ElMenuItem>
          );
        } else {
          return (
            <ElSubMenu
              index={fullPath}
              popperClass={
                menuMode === 'vertical' ? `menu-popper--vertical` : `menu-popper--horizontal`
              }
            >
              {{
                title: () => renderMenuTitle(meta),
                default: () => renderMenuItem(item.children!, fullPath)
              }}
            </ElSubMenu>
          );
        }
      }
    });
  };
  return {
    renderMenuItem
  };
};
