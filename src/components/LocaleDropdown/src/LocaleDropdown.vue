<script lang="ts" setup>
import { useLocaleStore } from '@/store/modules/locale';
import { useLocale } from '@/hooks/useLocale';

const localeStore = useLocaleStore();
const langMap = computed(() => localeStore.getLocaleMap);
const currentLang = computed(() => localeStore.getCurrentLocale);

const setLang = (lang: LocaleType) => {
  if (lang === unref(currentLang).lang) return;
  window.location.reload();
  localeStore.setCurrentLocale({
    lang
  });

  const { changeLocale } = useLocale();
  changeLocale(lang);
};
</script>

<template>
  <div>
    <el-dropdown trigger="click" @command="setLang">
      <icon-ion-language-sharp class="text-18" />
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item v-for="item in langMap" :key="item.lang" :command="item.lang">
            {{ item.name }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>
