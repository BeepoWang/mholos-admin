<template>
  <el-breadcrumb class="flex items-center h-full ml-[10px]" separator="/">
    <el-breadcrumb-item v-for="(item, index) in matched" :key="item.path">
      <span
        v-if="item.redirect === 'noRedirect' || index === matched.length - 1"
        class="flex items-center"
      >
        <el-icon v-if="breadcrumbIcon && item.meta.icon" class="mr-3">
          <component :is="iconRender({ icon: item.meta.icon })"></component>
        </el-icon>
        {{ item.meta.title }}
      </span>
      <a v-else @click.prevent="handleLink(item)" class="flex items-center">
        <el-icon v-if="breadcrumbIcon && item.meta.icon" class="mr-3">
          <component :is="iconRender({ icon: item.meta.icon })"></component>
        </el-icon>
        {{ item.meta.title }}
      </a>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script lang="ts" setup>
import { useIconRender } from '@/hooks/useIconRender';
import { useAppStore } from '@/store/modules/app';
import { RouteRecordRaw } from 'vue-router';

const router = useRouter();

const { iconRender } = useIconRender();
const appStore = useAppStore();
const breadcrumbIcon = computed(() => appStore.getBreadcrumbIcon);

const matched = computed(() => {
  return useRoute().matched.filter(
    (item) =>
      item.meta && item.meta.title && item.children.length !== 1 && item.meta.breadcrumb !== false
  );
});

const handleLink = (item: RouteRecordRaw) => {
  const path = item?.meta?.type === 'M' ? item.children?.[0].path : item.path;
  router.push(path as string);
};
</script>

<style lang="scss" scoped>
::v-deep(.el-breadcrumb__item) {
  display: flex;

  .el-breadcrumb__inner {
    display: flex;
    align-items: center;
    color: var(--top-header-text-color);

    &:hover {
      color: var(--el-color-primary);
    }
  }
}

::v-deep(.el-breadcrumb__item):not(:last-child) {
  .el-breadcrumb__inner {
    color: var(--top-header-text-color);

    &:hover {
      color: var(--el-color-primary);
    }
  }
}

::v-deep(.el-breadcrumb__item):last-child {
  .el-breadcrumb__inner {
    color: var(--el-text-color-placeholder);

    &:hover {
      color: var(--el-text-color-placeholder);
    }
  }
}
</style>
