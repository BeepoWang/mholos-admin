
interface UpdateUserParams {
  id: string
  departmentId?: string
  name?: string
  avatar?: string
  status?: number | null
  roleList?: string[]
}

interface UpdatePasswordParams {
  oldPassword: string
  newPassword: string
}

interface UpdateUserParams {
  id: string
  departmentId: string
  name?: string
  avatar?: string
  status?: number | null
  roleList?: string[]
}

interface UserItem {
  account: string
  avatar: string
  email: string
  id: string
  name: string
  phone: string
  departmentName: string
  departmentId: string
  status: number
  userRoleList: Array<UserRoleItem>
}

type UserListParams = Pages & Partial<Omit<UserItem, 'id' | 'userRoleList' | 'avatar'>>

interface AllRoleRes {
  list: Array<{
    id: string
    code: string
    name: string
    roles: RoleItem[]
  }>
}

interface RoleItem {
  code: string
  id: string
  name: string
}

interface RoleListParams {
  clientName: string
  code: string
  name: string
  scopeType: 0 | 1
  status: 0 | 1 | null
}

interface RoleListItem {
  id: string
  code: string
  name: string
  scopeType: number
  remark: string
  sortNum: number
  status: string | number
  defaultFlag: number
  clientId: string
  clientCode: string
  clientName: string
  rolePermissionList: {
    id: string
    name: string
    clientId: string
    pid: string
  }[]
}

interface DepartmentItem {
  code: string
  createTime: string
  id: string
  name: string
  pid: string
  remark: string
  sort: number
  status: number
  childNodes: DepartmentItem[]
}

interface MenuItem {
  id?: string;
  code: string;
  name: string;
  pid?: any;
  type: string;
  url: string;
  icon: string;
  remark: string;
  component?: string;
  sortNum?: any;
  display: number;
  activeMenu: string;
  childNodes: MenuItem[];
}

