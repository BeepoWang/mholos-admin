<template>
  <div class="login-sign-in">
    <p class="font-700 text-26px mb-30px">账号登录</p>
    <el-form ref="signInFormRef" :model="signInForm" size="large" :rules="rules">
      <el-form-item prop="username">
        <el-input
          v-model="signInForm.username"
          placeholder="请输入邮箱"
          autocomplete="off"
          clearable
          :prefix-icon="User"
        />
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          placeholder="请输入密码"
          type="password"
          v-model="signInForm.password"
          autocomplete="off"
          :prefix-icon="Lock"
          @keyup="keyClick"
        />
      </el-form-item>
    </el-form>
    <div class="pb-20px pt-10px">
      <p class="text-right text-14px text-#2080f0 pb-10px cursor-pointer" @click="forget">
        忘记密码？
      </p>
      <el-button
        type="primary"
        size="large"
        class="w-full"
        @click="login(signInFormRef)"
        :loading="buttonLoading"
      >
        {{ buttonText }}
      </el-button>
      <p class="pt-10px text-center text-14px text-#909399">
        <span>还没有帐号?</span>
        <span class="cursor-pointer text-#2080f0" @click="signUp">创建新帐号</span>
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useAuthStore } from '@/store/modules/auth';
import { User, Lock } from '@element-plus/icons-vue';
import { FormInstance, FormRules } from 'element-plus';

const signUp = inject<() => void>('signUp');
const forget = inject<() => void>('forget');

interface RuleForm {
  username: string;
  password: string;
}

const authStore = useAuthStore();
const router = useRouter();

const buttonText = ref('登录');
const buttonLoading = ref(false);
const signInFormRef = ref<FormInstance>();
const rules = ref<FormRules<RuleForm>>({
  username: { required: true, message: '请输入邮箱', trigger: 'blur' },
  password: { required: true, message: '请输入密码', trigger: 'blur' }
});
const signInForm = ref({
  password: '',
  username: ''
});

const keyClick = (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    login(signInFormRef.value);
  }
};

const login = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(async (valid) => {
    if (!valid) return;
    buttonLoading.value = true;
    buttonText.value = '登录中...';
    try {
      const res = await authStore.userLogin(signInForm.value);
      if (res.responseCode === 0) {
        ElMessage.success('登录成功,欢迎回来~ ');
        router.push({ path: '/' });
      }
    } catch (error) {
      console.log('error', error);
    } finally {
      buttonLoading.value = false;
      buttonText.value = '登录';
    }
  });
};
</script>

<style lang="scss" scoped>
.login-sign-in {
  user-select: none;
}
</style>
