import request from '@/utils/service/request';

// 获取系统头像列表
export function fetchAvatarList() {
  return request.get('/manage/user/getAvatarList');
}

// 修改用户信息
export function fetchUpdateUser(params: UpdateUserParams) {
  return request.put('/manage/user/editUser', params);
}
