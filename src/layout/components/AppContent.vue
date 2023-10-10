<script setup lang="ts">
import { useAppStore } from '@/store/modules/app';
import { useTagsViewStore } from '@/store/modules/tagsView';

const appStore = useAppStore();

const tagsView = computed(() => appStore.getTagsView);
const layout = computed(() => appStore.getLayout);
const fixedHeader = computed(() => appStore.getFixedHeader);

const tagsViewStore = useTagsViewStore();

const getCaches = computed((): string[] => {
  return tagsViewStore.getCachedViews;
});
</script>
<template>
  <section
    :class="[
      'layout-app-content p-[var(--app-content-padding)]  bg-[var(--app-content-bg-color)]',
      {
        '!min-h-[calc(100%-var(--app-content-padding)-var(--app-content-padding))]':
          (fixedHeader && (layout === 'classic' || layout === 'topLeft' || layout === 'top')) ||
          (!tagsView && layout === 'top'),
        '!min-h-[calc(100%-var(--app-content-padding)-var(--app-content-padding)-var(--tags-view-height))]':
          tagsView && layout === 'top',
        '!min-h-[calc(100%-var(--tags-view-height)-var(--app-content-padding)-var(--app-content-padding)-var(--top-tool-height))]':
          !fixedHeader && layout === 'classic',
        '!min-h-[calc(100%-var(tags-view-height)-var(--app-content-padding)-var(--app-content-padding))]':
          !fixedHeader && layout === 'topLeft',
        '!min-h-[calc(100%-var(--top-tool-height)-var(--app-content-padding)-var(--app-content-padding))]':
          fixedHeader && layout === 'cutMenu',
        '!min-h-[calc(100%-var(--top-tool-height)-var(--app-content-padding)-var(--app-content-padding)-var(--tags-view-height))]':
          !fixedHeader && layout === 'cutMenu'
      }
    ]"
  >
    <router-view>
      <template #default="{ Component, route }">
        <KeepAlive :include="getCaches">
          <Component :is="Component" :key="route.fullPath"></Component>
        </KeepAlive>
      </template>
    </router-view>
  </section>
</template>
