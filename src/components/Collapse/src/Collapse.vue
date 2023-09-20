<template>
  <div @click="setCollapse" class="cursor-pointer">
    <icon-ri-menu-fold-fill v-show="!collapse" />
    <icon-ri-menu-unfold-fill v-show="collapse" />
  </div>
</template>

<script lang="ts" setup>
import { useAppStore } from '@/store/modules/app';

const appStore = useAppStore();
const collapse = computed(() => appStore.getCollapse);
const setCollapse = () => {
  const collapsed = unref(collapse);
  appStore.setCollapse(!collapsed);
};
</script>
