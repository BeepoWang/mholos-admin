<script setup lang="ts">
import { LocaleDropdown } from '@/components/LocaleDropdown';
import { useI18n } from '@/hooks/useI18n';
import { ElMessage } from 'element-plus';
import { ScreenFull } from '@/components/ScreenFull';
import { SizeDropdown } from '@/components/SizeDropdown';
import { Collapse } from '@/components/Collapse';
import { UserInfo } from '@/components/UserInfo';

const { t } = useI18n();

const showMessage = () => {
  ElMessage.error('hello world');
};
</script>

<template>
  <div>
    <div class="h-[var(--top-tool-height)] relative flex items-center justify-between">
      <div class="h-full flex items-center">
        <Collapse class="custom-hover"></Collapse>
      </div>
      <div class="h-full flex items-center">
        <ScreenFull class="custom-hover"></ScreenFull>
        <LocaleDropdown class="custom-hover"></LocaleDropdown>
        <SizeDropdown class="custom-hover"></SizeDropdown>
        <UserInfo class="custom-hover"></UserInfo>
      </div>
    </div>

    <el-button type="danger" @click="showMessage">{{ t('login.usernamePlaceholder') }}</el-button>

    <p class="test text-18">{{ t('login.signInTitle') }}</p>
  </div>
</template>

<style scoped lang="scss">
.test {
  color: $theme-color;
}
</style>
