<script setup lang="ts"></script>

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
      <p class="test text-18">特殊特</p>
    </div>
    <router-view></router-view>
  </div>
</template>

<style scoped lang="scss">
.test {
  color: $theme-color;
}
</style>
