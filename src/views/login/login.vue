<template>
  <div class="login">
    <div class="login-lang">
      <LocaleDropdown></LocaleDropdown>
    </div>
    <div class="login-card">
      <transition mode="out-in">
        <components :is="components"></components>
      </transition>
    </div>
  </div>
</template>

<script lang="ts" setup>
import SignIn from './components/SignIn.vue';
import SignUp from './components/SignUp.vue';
import ForgetPwd from './components/ForgetPwd.vue';

const components = computed(() => {
  switch (loginType.value) {
    case 'signIn':
      return SignIn;
    case 'signUp':
      return SignUp;
    case 'forget':
      return ForgetPwd;
    default:
      return SignIn;
  }
});

type LoginFormType = 'signIn' | 'signUp' | 'forget';
const loginType = ref<LoginFormType>('signIn');

provide('forget', () => (loginType.value = 'forget'));
provide('signUp', () => (loginType.value = 'signUp'));
provide('signIn', () => (loginType.value = 'signIn'));
</script>

<style lang="scss" scoped>
.login {
  display: flex;
  height: 100%;
  padding: $base-padding;
  background-image: url(@/assets/images/logo-login.png), url(@/assets/images/bg.jpg);
  background-position:
    top 20px left 40px,
    center;
  background-repeat: no-repeat;
  background-size: auto, cover;
  user-select: none;
  align-items: center;
  justify-content: end;

  &-lang {
    position: absolute;
    top: 5%;
    right: 5%;
  }

  &-card {
    width: 40%;
    min-height: 35%;
    padding: 35px;
    margin-right: 10%;
    background-color: #fff;
    border-top: 4px solid #2080f0;
    border-radius: 3px;
    filter: drop-shadow(2px 2px 5px #ccc);
  }
}
</style>
