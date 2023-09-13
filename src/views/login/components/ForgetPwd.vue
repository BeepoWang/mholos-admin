<template>
  <div class="login-forget">
    <p class="font-700 text-26px mb-30px">忘记密码 🔒</p>
    <el-form
      ref="forgetFormRef"
      :model="forgetForm"
      :rules="rules"
      size="large"
      label-width="70px"
      label-position="left"
    >
      <el-form-item label="邮箱" prop="email">
        <el-input
          v-model="forgetForm.email"
          placeholder="请输入邮箱"
          autocomplete="off"
          clearable
        />
      </el-form-item>
      <el-form-item label="验证码" prop="code">
        <div class="flex-center w-full">
          <el-input
            v-model="forgetForm.code"
            placeholder="请注意查看邮箱验证码"
            clearable
            class="w-60%! mr-15"
            autocomplete="off"
          />
          <el-button type="primary" plain :disabled="isSend" @click="sendEmailCode">
            {{ codeTips }}
          </el-button>
        </div>
      </el-form-item>
      <el-form-item label="新密码" prop="password">
        <el-input
          type="password"
          v-model="forgetForm.password"
          placeholder="密码要求6-18位,且包含数字、字母"
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
        确认
      </el-button>
      <p class="text-center cursor-pointer text-#2080f0 pt-15px text-14px" @click="signIn">
        去登陆
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { fetchForgetPasswordCode, fetchResetPassword } from '@/api/login';
import { useCutDown } from '@/hooks/useCutDown';
import { FormInstance, FormRules } from 'element-plus';

const signIn = inject<() => void>('signIn')!;

const buttonLoading = ref(false);
const forgetFormRef = ref<FormInstance>();
const forgetForm = ref({
  email: '',
  code: '',
  password: ''
});
const rules = ref<FormRules<typeof forgetForm>>({
  code: { required: true, message: '请输入邮箱验证码', trigger: 'blur' },
  email: [
    {
      type: 'email',
      required: true,
      message: '请设置正确的邮箱地址',
      trigger: 'blur'
    }
  ],
  password: [
    { required: true, message: '请设置登录密码', trigger: 'blur' },
    {
      pattern: /^(?=.*[0-9])(?=.*[a-zA-Z])[0-9a-zA-Z]{6,16}/,
      message: '密码要求6-18位,且包含数字、字母',
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
        ElMessage.success('密码重置成功,快去登录吧~');
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
        ElMessage.success('验证码发送成功,请注意查收');
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
