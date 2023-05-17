// 用户信息
export interface userName {
  avatar: string;
  email: string;
  id: number;
  name: string;
  phone: string
  type: number;
  username: string;
}
// 用户部门和职位信息
export interface userDepartment {
  id: string;
  name: string;
  description: string;
  path: string;
}
// 用户组织
export interface userCompany {
  account: number;
  addressBookType: number;
  appMenuList: string[];
  avatar: string;
  id: number;
  name: string;
  status: number;
}