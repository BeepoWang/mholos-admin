<script setup lang="ts">
import { ConfigProviderProps } from 'element-plus';

const elConfig = ref<Partial<ConfigProviderProps>>({
  size: 'default',
  message: {
    max: 3
  }
});
</script>

<template>
  <ElConfigProvider :size="elConfig.size" :message="elConfig.message">
    <router-view></router-view>
  </ElConfigProvider>
</template>
