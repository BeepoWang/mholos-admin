<template>
  <div class="login-forget">
    <p class="font-700 text-26px mb-30px">{{ t('forget.forget') }} 🔒</p>
    <el-form
      ref="forgetFormRef"
      :model="forgetForm"
      :rules="rules"
      size="large"
      label-width="140px"
      label-position="left"
    >
      <el-form-item :label="t('register.email')" prop="email">
        <el-input
          v-model="forgetForm.email"
          :placeholder="t('register.emailPlaceholder')"
          autocomplete="off"
          clearable
        />
      </el-form-item>
      <el-form-item :label="t('login.code')" prop="code">
        <div class="flex-center w-full">
          <el-input
            v-model="forgetForm.code"
            :placeholder="t('register.codePlaceholder')"
            clearable
            class="w-65%! mr-15"
            autocomplete="off"
          />
          <el-button type="primary" plain :disabled="isSend" @click="sendEmailCode">
            {{ codeTips }}
          </el-button>
        </div>
      </el-form-item>
      <el-form-item :label="t('forget.newPwd')" prop="password">
        <el-input
          type="password"
          v-model="forgetForm.password"
          :placeholder="t('register.passwordPlaceholder')"
          autocomplete="off"
          clearable
        />
        <!-- show-password -->
      </el-form-item>
    </el-form>
    <div class="pb-20px pt-10px">
      <el-button
        size="large"
        class="w-full"
        type="primary"
        :loading="buttonLoading"
        @click="confirmClick(forgetFormRef)"
      >
        {{ t('common.confirm') }}
      </el-button>
      <p class="text-center cursor-pointer text-#2080f0 pt-15px text-14px" @click="signIn">
        {{ t('forget.login') }}
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { fetchForgetPasswordCode, fetchResetPassword } from '@/api/login';
import { useCutDown } from '@/hooks/useCutDown';
import { FormInstance, FormRules } from 'element-plus';

import { useI18n } from '@/hooks/useI18n';

const { t } = useI18n();

const signIn = inject<() => void>('signIn')!;

const buttonLoading = ref(false);
const forgetFormRef = ref<FormInstance>();
const forgetForm = ref({
  email: '',
  code: '',
  password: ''
});
const rules = ref<FormRules<typeof forgetForm>>({
  code: { required: true, message: t('common.required'), trigger: 'blur' },
  email: [
    {
      type: 'email',
      required: true,
      message: t('common.required'),
      trigger: 'blur'
    }
  ],
  password: [
    { required: true, message: t('common.required'), trigger: 'blur' },
    {
      pattern: /^(?=.*[0-9])(?=.*[a-zA-Z])[0-9a-zA-Z]{6,16}/,
      message: t('register.passwordPlaceholder'),
      trigger: 'blur'
    }
  ]
});

// 确认修改
const confirmClick = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl
    .validate(async (valid) => {
      if (!valid) return;
      buttonLoading.value = true;
      const { email, code, password } = forgetForm.value;
      const res = await fetchResetPassword({ email, emailCode: code, password });
      if (res.responseCode === 0) {
        ElMessage.success(t('forget.resetSuccTips'));
        signIn();
      }
    })
    .finally(() => {
      buttonLoading.value = false;
    });
};

// 邮箱验证码
const { codeTips, isSend, setCountdown } = useCutDown(60);
const sendEmailCode = () => {
  console.log('sendEmailCode');
  if (!forgetFormRef.value) return;
  forgetFormRef.value
    .validateField('email')
    .then(async (valid: any) => {
      console.log(valid);
      if (!valid) return;
      const { email } = forgetForm.value;
      const res = await fetchForgetPasswordCode({ email });
      if (res.responseCode === 0) {
        ElMessage.success(t('forget.sendCodeSuccTips'));
        setCountdown();
      } else {
        console.log(res);
        // ElMessage.error(res.responseMessage)
      }
    })
    .catch((err) => {
      console.log(err);
    });
};
</script>

<style lang="scss" scoped>
.login-forget {
  user-select: none;
}
</style>
