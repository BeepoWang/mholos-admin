<script setup lang="ts">
import { ConfigProviderProps } from 'element-plus';
import { useAppStore } from '@/store/modules/app';

const appStore = useAppStore();

const currentSize = computed(() => appStore.getCurrentSize);

const elConfig = ref<Partial<ConfigProviderProps>>({
  message: {
    max: 3
  }
});
</script>

<template>
  <ElConfigProvider :size="currentSize" :message="elConfig.message">
    <router-view></router-view>
  </ElConfigProvider>
</template>
