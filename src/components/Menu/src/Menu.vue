<template>
  <div
    :class="[
      'layout-menu h-100% overflow-hidden flex-col',
      {
        'w-[var(--left-menu-min-width)]': collapse,
        'w-[var(--left-menu-max-width)]': !collapse
      }
    ]"
  >
    <ElScrollbar>
      <el-menu
        :collapse="collapse"
        :unique-opened="uniqueOpened"
        :default-active="activeMenu"
        @select="menuSelect"
      >
        <MenuItem v-for="menu in menuOptions" :key="menu.path" :menuList="menu" />
      </el-menu>
    </ElScrollbar>
  </div>
</template>

<script lang="ts" setup>
import { useAppStore } from '@/store/modules/app';
import MenuItem from './components/MenuItem.vue';
import { isUrl } from '@/utils/is';
import { usePermissionStore } from '@/store/modules/permission';

const permissionStore = usePermissionStore();
const menuOptions = computed(() => permissionStore.getMenus);

const appStore = useAppStore();
const collapse = computed(() => appStore.getCollapse);
const uniqueOpened = computed(() => appStore.getUniqueOpened);

const { push, currentRoute } = useRouter();
const activeMenu = computed(() => {
  const { meta, path } = unref(currentRoute);
  // if set path, the sidebar will highlight the path you set
  if (meta.activeMenu) {
    return meta.activeMenu as string;
  }
  return path;
});

const menuSelect = (index: string) => {
  if (isUrl(index)) {
    window.open(index);
  } else {
    push(index);
  }
};
</script>

<style lang="scss" scoped>
.layout-menu {
  position: relative;
  transition: width var(--transition-time-02);

  ::v-deep(.el-menu) {
    width: var(--left-menu-max-width) !important;
    overflow-y: auto;
    border-right: 0 none;

    .el-menu-item {
      transition: opacity 0.2s ease-in-out;
    }
  }

  ::v-deep(.el-menu--collapse) {
    width: var(--left-menu-min-width) !important;

    & > .is-active,
    & > .is-active > .el-sub-menu__title {
      position: relative;
    }
  }

  ::v-deep(.horizontal-collapse-transition) {
    .layout-menu__title {
      display: none;
    }

    .layout-menu__icon {
      display: none;
    }
  }
}
</style>
