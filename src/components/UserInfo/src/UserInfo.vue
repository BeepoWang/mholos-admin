<script lang="ts" setup>
import UpdatePassword from './components/UpdatePassword.vue';
import PersonalSetting from './components/PersonalSetting.vue';
import { useI18n } from '@/hooks/useI18n';
import { useRouter } from 'vue-router';
import { useStorage } from '@/hooks/useStorage';

const { t } = useI18n();
const { clear } = useStorage();
const { replace } = useRouter();

const updateVisible = ref(false);
const settingVisible = ref(false);

const handleCommand = (command: string) => {
  if (command === 'update') {
    updateVisible.value = true;
  } else if (command === 'user') {
    settingVisible.value = true;
  } else if (command === 'logout') {
    loginOut();
  }
};

const loginOut = () => {
  ElMessageBox.confirm(t('common.loginOutMessage'), t('common.reminder'), {
    confirmButtonText: t('common.confirm'),
    cancelButtonText: t('common.cancel'),
    type: 'warning'
  })
    .then(async () => {
      clear();
      replace('/login');
    })
    .catch(() => {});
};
</script>

<template>
  <div>
    <el-dropdown trigger="click" @command="handleCommand">
      <div class="flex items-center">
        <img
          src="@/assets/images/avatar.jpg"
          alt=""
          class="w-[calc(var(--logo-height)-25px)] rounded-[50%]"
        />
        <span class="<lg:hidden text-14 pl-5 text-[var(--top-header-text-color)]"> Archer </span>
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="user">
            <span class="i-ri-account-circle-line"></span>
            <span>{{ t('common.setting') }}</span>
          </el-dropdown-item>
          <el-dropdown-item command="update">
            <span class="i-ri-lock-password-line"></span>
            <span>{{ t('common.update') }}</span>
          </el-dropdown-item>
          <el-dropdown-item command="logout">
            <span class="i-ri-logout-circle-line"></span>
            <span>{{ t('common.logout') }}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <UpdatePassword v-model:isVisible="updateVisible"></UpdatePassword>
    <PersonalSetting v-model:isVisible="settingVisible"></PersonalSetting>
  </div>
</template>
