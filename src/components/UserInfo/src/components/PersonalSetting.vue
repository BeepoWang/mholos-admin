<template>
  <el-dialog
    class="update-password"
    width="50%"
    v-model="dialogVisible"
    :title="t('common.setting')"
  >
    <div class="flex w-full h-full items-center justify-around">
      <el-form size="large" :model="userForm" ref="userFormRef" label-position="top">
        <el-form-item :label="t('register.username')" prop="userForm.name">
          <el-input
            v-model="userForm.name"
            :placeholder="t('register.usernamePlaceholder')"
            clearable
          />
        </el-form-item>
        <el-form-item :label="t('register.account')" prop="userForm.account" class="w-300px">
          <el-input
            v-model="userForm.email"
            :placeholder="t('register.accountPlaceholder')"
            disabled
          />
        </el-form-item>
        <el-form-item :label="t('register.email')" prop="userForm.email" class="w-300px">
          <el-input
            v-model="userForm.email"
            :placeholder="t('register.emailPlaceholder')"
            disabled
          />
        </el-form-item>
      </el-form>
      <div class="flex flex-col items-center ml-15px">
        <el-avatar :src="selectAvatar?.fileUrl" :size="100" class="mb-15px"></el-avatar>
        <div class="avatar-box h-150px overflow-y-scroll overflow-x-hidden">
          <el-avatar
            v-for="avatar in avatarList"
            :src="avatar.fileUrl"
            :key="avatar.fileId"
            class="m-5px border-2"
            :size="48"
            :class="avatar.fileId === selectAvatar?.fileId && 'border-black'"
            @click="selectAvatar = avatar"
          ></el-avatar>
        </div>
      </div>
    </div>
    <template #footer>
      <el-button @click="cancel">{{ t('common.cancel') }}</el-button>
      <el-button type="primary" @click="saveUser" :loading="dialogLoading">
        {{ t('common.confirm') }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { fetchAvatarList, fetchUpdateUser } from '@/api/system';
import { useAuthStore } from '@/store/modules/auth';
import { useI18n } from '@/hooks/useI18n';
import { FormInstance } from 'element-plus';
interface AvatarItem {
  fileId: string;
  fileUrl: string;
}

const { t } = useI18n();

const authStore = useAuthStore();
const userInfo = computed(() => authStore.getUserInfo);

const props = defineProps({
  isVisible: {
    type: Boolean
  }
});
const emits = defineEmits(['update:isVisible']);

const dialogVisible = computed({
  get: () => props.isVisible,
  set: (val) => {
    console.log(val);
    emits('update:isVisible', val);
  }
});
const dialogLoading = ref(false);
const userFormRef = ref<FormInstance>();
const userForm = ref({
  id: userInfo.value.id,
  name: userInfo.value.nickName,
  email: userInfo.value.email
});

// 修改用户头像
const avatarList = ref<AvatarItem[]>([]);
const selectAvatar = ref<AvatarItem>();
const getAvatarList = async () => {
  const { data } = await fetchAvatarList();
  avatarList.value = data.list;
  selectAvatar.value = data.list.find((item: AvatarItem) => item.fileUrl === userInfo.value.avatar);
};
getAvatarList();

const saveUser = async () => {
  userFormRef.value?.validate(async (valid) => {
    if (!valid) return false;
    dialogLoading.value = true;
    const params = {
      id: userForm.value.id,
      name: userForm.value.name,
      avatar: selectAvatar?.value?.fileId,
      status: 0
    };
    const res = await fetchUpdateUser(params);
    if (Number(res.responseCode) === 0) {
      ElMessage.success('修改成功');
      authStore.getUserDetail();
      dialogLoading.value = false;
    } else {
      ElMessage.error(res.responseMessage);
      dialogLoading.value = false;
    }
  });
};

const cancel = () => {
  userFormRef.value?.resetFields();
  dialogVisible.value = false;
  dialogLoading.value = false;
};
</script>

<style lang="scss" scoped>
@import '@/styles/mixin';

.avatar-box {
  @include base-scrollbar;
}
</style>
