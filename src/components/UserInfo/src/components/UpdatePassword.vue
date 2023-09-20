<template>
  <el-dialog
    class="update-password"
    width="500px"
    v-model="dialogVisible"
    :title="t('forget.title')"
  >
    <el-form :model="userForm" size="large" label-position="top" ref="userFormRef" :rules="rules">
      <el-form-item :label="t('register.email')" prop="userForm.email">
        <el-input
          v-model="userForm.email"
          :placeholder="t('forget.emailPlaceholder')"
          disabled
          class="select-none"
        />
      </el-form-item>
      <el-form-item :label="t('forget.oldPwd')" prop="oldPassword">
        <el-input
          type="password"
          v-model="userForm.oldPassword"
          autocomplete="off"
          :placeholder="t('forget.oldPwdPlaceholder')"
          clearable
          class="select-none"
        />
      </el-form-item>
      <el-form-item :label="t('forget.newPwd')" prop="newPassword">
        <el-input
          type="password"
          autocomplete="off"
          v-model="userForm.newPassword"
          :placeholder="t('register.passwordPlaceholder')"
          clearable
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="cancel">{{ t('common.cancel') }}</el-button>
      <el-button type="primary" @click="updatePassword" :loading="dialogLoading">
        {{ t('common.confirm') }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { fetchUpdatePassword } from '@/api/common';
import type { FormInstance, FormRules } from 'element-plus';
import { useRouter } from 'vue-router';
import { useI18n } from '@/hooks/useI18n';

const { t } = useI18n();
const router = useRouter();
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
  email: '',
  oldPassword: '',
  newPassword: ''
});
const rules = ref<FormRules<typeof userForm>>({
  oldPassword: [{ required: true, message: t('common.required'), trigger: 'blur' }],
  newPassword: [
    { required: true, message: t('common.required'), trigger: 'blur' },
    {
      pattern: /^(?=.*[0-9])(?=.*[a-zA-Z])[0-9a-zA-Z]{6,18}/,
      message: t('register.passwordPlaceholder'),
      trigger: 'blur'
    }
  ]
});

const updatePassword = () => {
  userFormRef.value?.validate(async (valid) => {
    if (!valid) return false;
    dialogLoading.value = true;
    const { oldPassword, newPassword } = userForm.value;
    const res = await fetchUpdatePassword({ oldPassword, newPassword });
    if (res.responseCode === 0) {
      ElMessage.success(t('forget.updateSuccTips'));
      dialogLoading.value = false;
      router.push('/login');
    } else {
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
.update-password {
  width: 100%;
}
</style>
