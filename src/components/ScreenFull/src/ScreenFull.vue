<template>
  <div @click="toggleFullscreen">
    <icon-ri-fullscreen-exit-fill v-show="isFullscreen" class="text-18px" />
    <icon-ri-fullscreen-fill v-show="!isFullscreen" class="text-18px" />
  </div>
</template>

<script lang="ts" setup>
import { useFullscreen } from '@vueuse/core';
const { toggle, isFullscreen } = useFullscreen();

const toggleFullscreen = () => {
  toggle();
};
</script>
