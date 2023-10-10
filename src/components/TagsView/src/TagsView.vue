<template>
  <div class="tags-view flex w-full relative bg-#fff">
    <span
      class="tags-view__tool tags-view__tool--first w-[var(--tags-view-height)] h-[var(--tags-view-height)] flex items-center justify-center cursor-pointer"
    >
      <icon-ep-d-arrow-left
        class="color-[var(--el-text-color-placeholder)] hover:color-[var(--el-color-black)]"
      >
      </icon-ep-d-arrow-left>
    </span>
    <div class="overflow-hidden flex-1">
      <ElScrollbar ref="scrollbarRef" @scroll="scroll" class="h-full">
        <div class="flex h-full">
          <div
            v-for="item in visitedViews"
            :key="item.fullPath"
            :class="[
              'tags-view__item',
              item.meta.affix ? 'tags-view__item--affix' : '',
              { 'is-active': isActive(item) }
            ]"
          >
            <router-link :to="{ ...item }">
              <div class="h-full flex justify-center items-center whitespace-nowrap pl-15px">
                <el-icon
                  v-if="item?.matched && item?.matched[1] && item?.matched[1]?.meta?.icon"
                  class="mr-5"
                  :size="12"
                >
                  <component :is="iconRender({ icon: item.meta.icon as string })"></component>
                </el-icon>
                {{ item.meta.title }}
                <icon-mdi-close
                  class="tags-view__item--close color-#333 text-12"
                  @click.prevent.stop="closeSelectTag(item)"
                />
              </div>
            </router-link>
          </div>
        </div>
      </ElScrollbar>
    </div>
    <span
      class="tags-view__tool w-[var(--tags-view-height)] h-[var(--tags-views-height)] flex items-center justify-center cursor-pointer"
    >
      <icon-ep-d-arrow-right class="color-[var(--el-text-color-placeholder)]">
      </icon-ep-d-arrow-right>
    </span>
    <span
      class="tags-view__tool w-[var(--tags-view-height)] h-[var(--tags-views-height)] flex items-center justify-center cursor-pointer"
    >
      <icon-mdi-refresh
        class="color-[var(--el-text-color-placeholder)] hover:color-[var(--el-color-black)]"
      ></icon-mdi-refresh>
    </span>
  </div>
</template>

<script lang="ts" setup>
import { ElScrollbar } from 'element-plus';
import { RouteLocationNormalizedLoaded } from 'vue-router';
import { filterAffixTags } from './helper';
import { usePermissionStore } from '@/store/modules/permission';
import { useTagsViewStore } from '@/store/modules/tagsView';
import { cloneDeep } from 'lodash-es';
import { useTagsView } from '@/hooks/useTagsView';
import { useIconRender } from '@/hooks/useIconRender';
const { iconRender } = useIconRender();

const { currentRoute, push } = useRouter();

const { closeCurrent } = useTagsView();

const tagsViewStore = useTagsViewStore();
const visitedViews = computed(() => tagsViewStore.getVisitedViews);

const permissionStore = usePermissionStore();
const routers = computed(() => permissionStore.getRouters);
watch(
  () => currentRoute.value,
  () => {
    addTags();
  }
);

// 是否是当前tag
const isActive = (route: RouteLocationNormalizedLoaded): boolean => {
  return route.path === unref(currentRoute).path;
};

const addTags = () => {
  const { name } = unref(currentRoute);
  if (name) {
    tagsViewStore.setSelectedTag(unref(currentRoute));
    tagsViewStore.addViews(unref(currentRoute));
  }
};

const closeSelectTag = (view: RouteLocationNormalizedLoaded) => {
  closeCurrent(view, () => {
    if (isActive(view)) {
      toLastView();
    }
  });
};

const toLastView = () => {
  const visitedViews = tagsViewStore.getVisitedViews;
  const latestView = visitedViews.slice(-1)[0];
  if (latestView) {
    push(latestView);
  } else {
    if (
      unref(currentRoute).path === permissionStore.getAddRouters[0].path ||
      unref(currentRoute).path === permissionStore.getAddRouters[0].redirect
    ) {
      addTags();
      return;
    }
    push(permissionStore.getAddRouters[0].path);
  }
};
// 滚动到选中的tag
// const moveToCurrentTag = async () => {
//   await nextTick()
//   for (const v of unref(visitedViews)) {
//     if (v.fullPath === unref(currentRoute).path) {
//       moveToTarget(v)
//       if (v.fullPath !== unref(currentRoute).fullPath) {
//         tagsViewStore.updateVisitedView(unref(currentRoute))
//       }

//       break
//     }
//   }
// }

const affixTagArr = ref<RouteLocationNormalizedLoaded[]>([]);
const initTags = () => {
  affixTagArr.value = filterAffixTags(unref(routers));
  for (const tag of unref(affixTagArr)) {
    if (tag.name) {
      tagsViewStore.addVisitedView(cloneDeep(tag));
    }
  }
};

const scrollbarRef = ref<ComponentRef<typeof ElScrollbar>>();
const scrollLeftNumber = ref(0);
const scroll = ({ scrollLeft }) => {
  scrollLeftNumber.value = scrollLeft as number;
};
// const move = (to: number) => {
//   const wrap$ = unref(scrollbarRef)?.wrapRef
//   const {}
// }
onMounted(() => {
  initTags();
  addTags();
});
</script>

<style lang="scss" scoped>
.tags-view {
  &__tool {
    position: relative;

    &::before {
      position: absolute;
      top: 1px;
      left: 0;
      width: 100%;
      height: calc(100% - 1px);
      border-left: 1px solid var(--el-border-color);
      content: '';
    }

    &--first {
      &::before {
        position: absolute;
        top: 1px;
        left: 0;
        width: 100%;
        height: calc(100% - 1px);
        border-right: 1px solid var(--el-border-color);
        border-left: none;
        content: '';
      }
    }
  }

  &__item {
    position: relative;
    top: 2px;
    height: calc(100% - 6px);
    padding-right: 25px;
    margin-left: 4px;
    font-size: 12px;
    cursor: pointer;
    border: 1px solid #d9d9d9;
    border-radius: 2px;

    &--close {
      position: absolute;
      top: 50%;
      right: 5px;
      display: none;
      transform: translate(0, -50%);
    }

    &:not(.tags-view__item--affix):hover {
      .tags-view__item--close {
        display: block;
      }
    }
  }

  &__item:not(.is-active) {
    &:hover {
      color: var(--el-color-primary);
    }
  }

  &__item.is-active {
    color: var(--el-color-white);
    background-color: var(--el-color-primary);
    border: 1px solid var(--el-color-primary);

    .tags-view__item--close {
      // :deep(svg) {
      color: var(--el-color-white) !important; // }
    }
  }
}
</style>
