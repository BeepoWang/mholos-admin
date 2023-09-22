interface LoginParams {
  code?: string
  password: string
  username: string
}
interface LoginRes {
  expires: number
  header: string
  refreshToken: string
  token: string
  tokenType: string
}

interface RegisterParams {
  email: string
  emailCode: string
  name: string
  password: string
}

interface UserInfo {
  age: string
  avatar: string
  birthday: string
  email: string
  id: string
  nickName: string
  school: string
  sex: string
  signature: string
  rolePermissionList: RolePermissionList
}

interface RolePermissionList {
  roles: Role[]
  permissions: Permission[]
}

interface Permission {
  visible: boolean
  id: string
  pid?: string
  code: string
  name: string
  component: string
  type: menuType
  url: string
  icon: string
  childNodes?: Permission[]
  [key: string]: any
}
