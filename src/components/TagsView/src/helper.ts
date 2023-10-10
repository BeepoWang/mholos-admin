import { pathResolve } from '@/utils/routerHelper';
import { RouteLocationNormalizedLoaded } from 'vue-router';

export const filterAffixTags = (routes: AppRouteRecordRaw[], parentPath = '') => {
  let tags: RouteLocationNormalizedLoaded[] = [];

  routes.forEach((route) => {
    const meta = route.meta ?? {};
    const tagPath = pathResolve(parentPath, route.path);
    if (meta.affix) {
      tags.push({ ...route, path: tagPath, fullPath: tagPath } as RouteLocationNormalizedLoaded);
    }
    if (route.children) {
      const temTags = filterAffixTags(route.children, tagPath);
      if (temTags.length >= 1) {
        tags = [...tags, ...temTags];
      }
    }
  });

  return tags;
};
