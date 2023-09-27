<template>
  <el-sub-menu v-if="menuList.children && menuList.children.length > 1" :index="menuList.path">
    <template #title>
      <el-icon>
        <component :is="menuList.icon"></component>
      </el-icon>
      <span class="layout-menu__title">{{ menuList.title }}</span>
    </template>
    <el-menu-item v-for="child in menuList.children" :key="child.path" :index="child.path">
      <el-icon class="layout-menu__icon">
        <component :is="child.icon"></component>
      </el-icon>
      <template #title>
        <span class="layout-menu__title">{{ child.title }}</span>
      </template>
    </el-menu-item>
  </el-sub-menu>
  <el-menu-item v-else :key="menuList.path" :index="menuList.path">
    <el-icon>
      <component :is="menuList.icon"></component>
    </el-icon>
    <template #title>
      <span class="layout-menu__title">{{ menuList.title }}</span>
    </template>
  </el-menu-item>
</template>

<script lang="ts" setup>
interface Props {
  menuList: Record<string, any>;
}

defineProps<Props>();
</script>

<style lang="scss" scoped>
.layout-sidebar-menu-item {
  width: 100%;
}
</style>
