import request from '@/utils/service/request';

// 修改密码
export function fetchUpdatePassword(params: UpdatePasswordParams) {
  return request.put('/manage/modify/password/edit', params);
}
