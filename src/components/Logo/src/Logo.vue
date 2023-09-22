<script setup lang="ts">
import { useAppStore } from '@/store/modules/app';

const appStore = useAppStore();

const show = ref(true);
const title = computed(() => appStore.getTitle);
const layout = computed(() => appStore.getLayout);
const collapse = computed(() => appStore.getCollapse);

onMounted(() => {
  if (unref(collapse)) show.value = false;
});

watch(
  () => collapse.value,
  (collapse) => {
    if (unref(layout) === 'topLeft' || unref(layout) === 'cutMenu') {
      show.value = true;
      return;
    }
    if (!collapse) {
      setTimeout(() => {
        show.value = !collapse;
      }, 400);
    } else {
      show.value = !collapse;
    }
  }
);

watch(
  () => layout.value,
  (layout) => {
    if (layout === 'top' || layout === 'cutMenu') {
      show.value = true;
    } else {
      if (unref(collapse)) {
        show.value = true;
      } else {
        show.value = false;
      }
    }
  }
);
</script>

<template>
  <div>
    <router-link
      to="/"
      class="flex items-center cursor-pointer pl-8 relative decoration-none overflow-hidden h-[var(--logo-height)]"
    >
      <img src="@/assets/images/logo.png" class="w-[calc(var(--logo-height)+10px)]" />
      <div
        v-if="show"
        :class="[
          'ml-10 text-14 font-700',
          {
            'text-[var(--logo-title-text-color)]': layout === 'classic',
            'text-[var(--top-header-text-color)]':
              layout === 'topLeft' || layout === 'top' || layout === 'cutMenu'
          }
        ]"
      >
        {{ title }}
      </div>
    </router-link>
  </div>
</template>
