<script setup lang="ts">
import { LocaleDropdown } from '@/components/LocaleDropdown';
import { useAppStore } from '@/store/modules/app';
import { useI18n } from '@/hooks/useI18n';

const appStore = useAppStore();
const { collapse } = storeToRefs(appStore);

const { t } = useI18n();

const showMessage = () => {
  ElMessage.error('hello world');
};
</script>

<template>
  <div>
    <icon-local-logo class="w-50px h-50px" />
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="@/assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>

    <el-button type="danger" @click="showMessage">{{ t('login.usernamePlaceholder') }}</el-button>
    <LocaleDropdown></LocaleDropdown>

    <p class="test text-18">{{ t('login.signInTitle') }}</p>

    <p>{{ collapse }}</p>
  </div>
</template>

<style scoped lang="scss">
.test {
  color: $theme-color;
}
</style>
