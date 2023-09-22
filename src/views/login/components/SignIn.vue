<template>
  <div class="login-sign-in">
    <p class="font-700 text-26px mb-30px">{{ t('login.signInTitle') }}</p>
    <el-form ref="signInFormRef" :model="signInForm" size="large" :rules="rules">
      <el-form-item prop="username">
        <el-input
          v-model="signInForm.username"
          :placeholder="t('login.emailPlaceholder')"
          autocomplete="off"
          clearable
          :prefix-icon="User"
        />
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          :placeholder="t('login.passwordPlaceholder')"
          type="password"
          v-model="signInForm.password"
          autocomplete="off"
          :prefix-icon="Lock"
          @keyup="keyClick"
        />
      </el-form-item>
    </el-form>
    <div class="pb-20px pt-10px text-right">
      <span class="inline-block text-14px text-#2080f0 pb-10px cursor-pointer" @click="forget">
        {{ t('login.forgetPassword') }}
      </span>
      <el-button
        type="primary"
        size="large"
        class="w-full"
        @click="login(signInFormRef)"
        :loading="buttonLoading"
      >
        {{ t('login.login') }}
      </el-button>
      <p class="pt-10px text-left text-14px text-#909399">
        <span class="cursor-pointer text-#2080f0" @click="signUp">
          {{ t('login.registerTips') }}
        </span>
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useAuthStore } from '@/store/modules/auth';
import { User, Lock } from '@element-plus/icons-vue';
import { ElMessage, FormInstance, FormRules } from 'element-plus';
import { useI18n } from '@/hooks/useI18n';

const { t } = useI18n();

const signUp = inject<() => void>('signUp');
const forget = inject<() => void>('forget');

interface RuleForm {
  username: string;
  password: string;
}

const authStore = useAuthStore();
const router = useRouter();

const buttonLoading = ref(false);
const signInFormRef = ref<FormInstance>();
const rules = ref<FormRules<RuleForm>>({
  username: { required: true, message: t('common.required'), trigger: 'blur' },
  password: { required: true, message: t('common.required'), trigger: 'blur' }
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
    try {
      const res = await authStore.userLogin(signInForm.value);
      if (res.responseCode === 0) {
        ElMessage.success(t('login.succTips'));
        router.push({ path: '/' });
        buttonLoading.value = false;
      }
    } catch (error) {
      console.log('error', error);
      buttonLoading.value = false;
    }
  });
};
</script>

<style lang="scss" scoped>
.login-sign-in {
  user-select: none;
}
</style>
