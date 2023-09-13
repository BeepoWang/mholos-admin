<script setup lang="ts">
import { useAppStore } from './store/modules/app';

const appStore = useAppStore();
const { collapse } = storeToRefs(appStore);
</script>

<template>
  <div>
    <icon-local-logo class="w-50px h-50px" />
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
    <div>
      <p class="test text-18">特殊特 {{ collapse }}</p>
    </div>
    <router-view></router-view>
  </div>
</template>

<style scoped lang="scss">
.test {
  color: $theme-color;
}
</style>
