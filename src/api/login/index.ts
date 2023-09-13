import request from '@/utils/service/request';

// 密码登录
export const fetchLogin = (data: LoginParams) => {
  return request.post<LoginRes>('/assets-manage/login/password', data);
};

// 获取邮箱验证码
export function fetchMailCode(data: { email: string }) {
  return request.post('/manage/register/email/code', data);
}

// 校验邮箱
export function fetchCheckEmail(data: { email: string }) {
  return request.post('/auth/register/email', data, { isShowToast: false });
}

// 用户注册
export function fetchRegister(data: RegisterParams) {
  return request.post('/manage/register/user', data);
}

// 重置密码通过邮箱
export function fetchResetPassword(data: { emailCode: string; email: string; password: string }) {
  return request.post('/manage/forget/password/checkEmail', data);
}

// 忘记密码获取邮箱验证码
export function fetchForgetPasswordCode(data: { email: string }) {
  return request.post('/manage/forget/password/email/code', data);
}
