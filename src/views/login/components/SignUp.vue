<template>
  <div class="login-sign-up">
    <p class="font-700 text-26px mb-30px">{{ t('register.join') }} 👋🏻</p>
    <el-form
      ref="signUpFormRef"
      :model="signUpForm"
      :rules="rules"
      size="large"
      label-width="140px"
      label-position="left"
    >
      <el-form-item :label="t('register.username')" prop="name">
        <el-input
          v-model="signUpForm.name"
          :placeholder="t('register.usernamePlaceholder')"
          autocomplete="off"
          clearable
        />
      </el-form-item>
      <el-form-item :label="t('register.email')" prop="email">
        <el-input
          v-model="signUpForm.email"
          :placeholder="t('register.emailPlaceholder')"
          autocomplete="off"
          clearable
        />
      </el-form-item>
      <el-form-item :label="t('login.code')" prop="emailCode">
        <div class="flex-center w-full">
          <el-input
            v-model="signUpForm.emailCode"
            :placeholder="t('register.codePlaceholder')"
            autocomplete="off"
            clearable
            class="w-65%! mr-15"
          />
          <el-button type="primary" plain :disabled="isSend" @click="sendEmailCode">
            {{ codeTips }}
          </el-button>
        </div>
      </el-form-item>
      <el-form-item :label="t('register.password')" prop="password">
        <el-input
          :placeholder="t('register.passwordPlaceholder')"
          show-password
          v-model="signUpForm.password"
          autocomplete="off"
          clearable
        />
      </el-form-item>
    </el-form>

    <div class="pb-20px pt-10px">
      <el-button
        type="primary"
        size="large"
        class="w-full"
        @click="registerClick(signUpFormRef)"
        :loading="buttonLoading"
      >
        {{ t('register.register') }}
      </el-button>
      <p class="text-center text-14px text-#909399 pt-10px">
        <span class="cursor-pointer text-#2080f0" @click="signIn">
          {{ t('register.hasUser') }}</span
        >
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { fetchMailCode, fetchRegister } from '@/api/login';
import { useCutDown } from '@/hooks/useCutDown';
import { FormInstance, FormRules } from 'element-plus';
import { validateEmail } from '@/utils/validate';
import { useI18n } from '@/hooks/useI18n';

const { t } = useI18n();
const signIn = inject<() => void>('signIn');

const buttonLoading = ref(false);
const signUpFormRef = ref<FormInstance>();
const signUpForm = ref({
  name: '',
  departmentId: null,
  password: '',
  email: '',
  emailCode: ''
});

const rules = ref<FormRules<typeof signUpForm>>({
  name: { required: true, max: 20, message: t('common.required'), trigger: 'blur' },
  emailCode: { required: true, message: t('common.required'), trigger: 'blur' },
  departmentId: { required: true, message: t('common.required'), trigger: 'blur' },
  email: [
    {
      type: 'email',
      required: true,
      message: t('common.required'),
      trigger: 'blur'
    },
    { asyncValidator: validateEmail, trigger: 'blur' }
  ],
  password: [
    { required: true, message: t('common.required'), trigger: 'blur' },
    {
      pattern: /^(?=.*[0-9])(?=.*[a-zA-Z])[0-9a-zA-Z]{6,18}/,
      message: t('register.passwordPlaceholder'),
      trigger: 'blur'
    }
  ]
});

// 注册
const registerClick = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl
    .validate(async (valid) => {
      if (!valid) return;
      buttonLoading.value = true;
      const { name, email, password, emailCode } = signUpForm.value;
      const res = await fetchRegister({
        name,
        email,
        password,
        emailCode
      });
      if (res.responseCode === 0) {
        ElMessage.success('注册成功');
        signIn?.();
      } else {
        // ElMessage.error(res.responseMessage)
      }
    })
    .finally(() => {
      buttonLoading.value = false;
    });
};

// 邮箱验证码
const { codeTips, isSend, setCountdown } = useCutDown(60);
const sendEmailCode = () => {
  signUpFormRef.value?.validateField('email').then(async (valid) => {
    if (!valid) return;
    const { email } = signUpForm.value;
    const res = await fetchMailCode({ email });
    if (res.responseCode === 0) {
      setCountdown();
    }
  });
};
</script>

<style lang="scss" scoped>
.login-sign-up {
  height: auto;
}
</style>
