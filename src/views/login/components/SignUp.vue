<template>
  <div class="login-sign-up">
    <p class="font-700 text-26px mb-30px">加入我们 👋🏻</p>
    <el-form
      ref="signUpFormRef"
      :model="signUpForm"
      :rules="rules"
      size="large"
      label-width="70px"
      label-position="left"
    >
      <el-form-item label="用户名" prop="name">
        <el-input
          v-model="signUpForm.name"
          placeholder="请设置用户名"
          autocomplete="off"
          clearable
        />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input
          v-model="signUpForm.email"
          placeholder="请设置邮箱,将作为默认登陆账号"
          autocomplete="off"
          clearable
        />
      </el-form-item>
      <el-form-item label="验证码" prop="emailCode">
        <div class="flex-center w-full">
          <el-input
            v-model="signUpForm.emailCode"
            placeholder="请注意查看邮箱验证码"
            autocomplete="off"
            clearable
            class="w-60%! mr-15"
          />
          <el-button type="primary" plain :disabled="isSend" @click="sendEmailCode">
            {{ codeTips }}
          </el-button>
        </div>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          placeholder="密码要求6-18位,且包含数字、字母"
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
        注册
      </el-button>
      <p class="text-center text-14px text-#909399 pt-10px">
        <span>已经有帐号?</span>
        <span class="cursor-pointer text-#2080f0" @click="signIn">去登陆</span>
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { fetchMailCode, fetchRegister } from '@/api/login';
import { useCutDown } from '@/hooks/useCutDown';
import { FormInstance, FormRules } from 'element-plus';
import { validateEmail } from '@/utils/validate';

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
  name: { required: true, max: 20, message: '请设置用户名', trigger: 'blur' },
  emailCode: { required: true, message: '请输入邮箱验证码', trigger: 'blur' },
  departmentId: { required: true, message: '请选择归属部门', trigger: 'blur' },
  email: [
    {
      type: 'email',
      required: true,
      message: '请设置正确的邮箱地址',
      trigger: 'blur'
    },
    { asyncValidator: validateEmail, trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请设置登录密码', trigger: 'blur' },
    {
      pattern: /^(?=.*[0-9])(?=.*[a-zA-Z])[0-9a-zA-Z]{6,18}/,
      message: '密码要求6-18位,且包含数字、字母',
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
