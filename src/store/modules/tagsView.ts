import { useStorage } from '@/hooks/useStorage';
import { router } from '@/router';
import { findIndex } from '@/utils';
import { getRawRoute } from '@/utils/routerHelper';
import { RouteLocationNormalizedLoaded } from 'vue-router';
import { store } from '..';

interface TagsViewState {
  visitedViews: RouteLocationNormalizedLoaded[];
  cachedViews: Set<string>;
  selectedTag?: RouteLocationNormalizedLoaded;
}

const { getStorage } = useStorage();

export const useTagsViewStore = defineStore('TagsView', {
  state(): TagsViewState {
    return {
      visitedViews: [],
      cachedViews: new Set(),
      selectedTag: undefined
    };
  },
  getters: {
    getVisitedViews(): RouteLocationNormalizedLoaded[] {
      return this.visitedViews;
    },
    getCachedViews(): string[] {
      return Array.from(this.cachedViews);
    },
    getSelectTag(): RouteLocationNormalizedLoaded | undefined {
      return this.selectedTag;
    }
  },
  actions: {
    addViews(view: RouteLocationNormalizedLoaded) {
      this.addVisitedView(view);
      this.addCachedView();
    },
    addVisitedView(view: RouteLocationNormalizedLoaded) {
      if (this.visitedViews.some((v) => v.path === view.path)) return;
      if (view.meta.noTagsView) return;
      this.visitedViews.push(Object.assign({}, view, { title: view.meta.title || 'no-name' }));
    },
    addCachedView() {
      const cacheMap: Set<string> = new Set();
      for (const v of this.visitedViews) {
        const item = getRawRoute(v);
        const needCache = !item.meta.noCache;
        if (!needCache) {
          continue;
        }
        const name = item.name as string;
        cacheMap.add(name);
      }
      if (Array.from(this.cachedViews).sort().toString() === Array.from(cacheMap).sort().toString())
        return;

      this.cachedViews = cacheMap;
    },
    delView(view: RouteLocationNormalizedLoaded) {
      this.delVisitedView(view);
      this.addCachedView();
    },
    delVisitedView(view: RouteLocationNormalizedLoaded) {
      for (const [i, v] of this.visitedViews.entries()) {
        if (v.path === view.path) {
          this.visitedViews.splice(i, 1);
        }
      }
    },
    delCachedView() {
      const route = router.currentRoute.value;
      const index = findIndex(this.getCachedViews, (v) => v === route.name);
      if (index > -1) {
        this.cachedViews.delete(this.getCachedViews[index]);
      }
    },
    delAllViews() {},
    delAllVisitedViews() {
      this.visitedViews = getStorage('userInfo')
        ? this.visitedViews.filter((tag) => tag.meta.affix)
        : [];
    },
    delOtherViews(view: RouteLocationNormalizedLoaded) {
      this.delOtherVisitedViews(view);
      this.addCachedView();
    },
    delOtherVisitedViews(view: RouteLocationNormalizedLoaded) {
      this.visitedViews = this.visitedViews.filter((v) => {
        return v.meta.affix || v.path === view.path;
      });
    },
    delLeftViews(view: RouteLocationNormalizedLoaded) {
      const index = findIndex<RouteLocationNormalizedLoaded>(
        this.visitedViews,
        (v) => v.path === view.path
      );
      if (index > -1) {
        this.visitedViews = this.visitedViews.filter((v, i) => {
          return v.meta.affix || v.path || i > index;
        });
        this.addCachedView();
      }
    },
    delRightViews(view: RouteLocationNormalizedLoaded) {
      const index = findIndex<RouteLocationNormalizedLoaded>(
        this.visitedViews,
        (v) => v.path === view.path
      );
      if (index > -1) {
        this.visitedViews = this.visitedViews.filter((v, i) => {
          return v.meta.affix || v.path === view.path || i < index;
        });
        this.addCachedView();
      }
    },
    updateVisitedView(view: RouteLocationNormalizedLoaded) {
      for (let v of this.visitedViews) {
        if (v.path === view.path) {
          v = Object.assign(v, view);
          break;
        }
      }
    },
    setSelectedTag(tag: RouteLocationNormalizedLoaded) {
      this.selectedTag = tag;
    },
    setTitle(title: string, path?: string) {
      for (const v of this.visitedViews) {
        if (v.path === (path ?? this.selectedTag?.path)) {
          v.meta.title = title;
          break;
        }
      }
    }
  }
});

export const useTagsViewStoreWithOut = () => {
  return useTagsViewStore(store);
};
