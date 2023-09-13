import request from '@/utils/service/request';

// 刷新token
export const fetchRefreshToken = (data: { refreshToken: string }) => {
  return request.post<LoginRes>('/assets-manage/token/refresh', data);
};

// 获取用户详情
export function fetchUserInfo() {
  return request.get<UserInfo>('/manage/info/getInfo', {}, { isShowToast: false });
}
