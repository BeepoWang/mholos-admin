import request from '@/utils/service/request';

// 获取系统头像列表
export function fetchAvatarList() {
  return request.get('/manage/user/getAvatarList');
}

// 修改用户信息
export function fetchUpdateUser(params: UpdateUserParams) {
  return request.put('/manage/user/editUser', params);
}

// 修改密码
export function fetchUpdatePassword(params: UpdatePasswordParams) {
  return request.put('/manage/modify/password/edit', params);
}

// 获取用户列表
export function fetchUserList(params: UserListParams) {
  return request.get('/manage/user/getList', params);
}

// 删除用户
export function fetchDeleteUser(params: { userId: string }) {
  return request.delete('/manage/user/remove', params);
}

// 获取角色下拉列表数据
export function fetchAllRole() {
  return request.get<AllRoleRes>('/manage/user/getRoleAll');
}

// ===部门管理====  //

// 获取部门列表
export function fetchDepartmentList(params: { name: string; status: number | null }) {
  return request.get<BasePageListRes<DepartmentItem>>('/manage/department/getList', params);
}
// 更新部门信息
export function fetchUpdateDepartment(params: Partial<Omit<DepartmentItem, 'childNodes'>>) {
  return request.put('/manage/department/edit', params);
}

// 删除部门
export function fetchDeleteDepartment(params: { id: string }) {
  return request.delete('/manage/department/remove', params);
}

//  新增部门
export function fetchAddDepartment(params: Partial<DepartmentItem>) {
  return request.post('/manage/department/save', params);
}

// ===角色管理====  //

// 获取角色列表
export function fetchRoleList(params: Partial<RoleListParams & Pages>) {
  return request.get<BasePageListRes<RoleListItem>>('/manage/role/getList', params);
}

// 删除角色
export function fetchDeleteRole(params: { id: string }) {
  return request.delete('/manage/role/remove', params);
}

// 更新角色信息
export function fetchUpdateRole(params: Partial<RoleListItem>) {
  return request.put('/manage/role/edit', params);
}

// 新增角色
export function fetchAddRole(params: Partial<RoleListItem>) {
  return request.post('/manage/role/save', params);
}

// 获取所有权限列表
export function fetchAuthAllTree() {
  return request.get('/manage/role/getPermissionAll');
}

// 保存角色权限列表
export function fetchSaveAuth(params: { id: string; permissionList: string[] }) {
  return request.put('/manage/role/editPermission', params);
}

// ===菜单管理====  //

// 获取菜单列表
export function fetchMenuList() {
  return request.get<BasePageListRes<MenuItem>>('/manage/permission/getList');
}

// 删除菜单
export function fetchDeleteMenu(params: { id: string }) {
  return request.delete('/manage/permission/remove', params);
}

// 更新菜单信息
export function fetchUpdateMenu(params: Partial<MenuItem>) {
  return request.put('/manage/permission/edit', params);
}

// 新增菜单
export function fetchAddMenu(params: Partial<MenuItem>) {
  return request.post('/manage/permission/save', params);
}
