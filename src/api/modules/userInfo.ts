import http from '../http'
import { AxiosPromise } from "axios";
import {userName,userDepartment,userCompany} from '@/constants/user'

// 获取用户头像姓名信息 
export function getUserNameApi(): AxiosPromise<userName>{
  return http.get('/robin/user/me')
}

// 获取用户部门
export function getUserDepartmentApi(usernameId:number): AxiosPromise<userName>{
  return http.get('/usopp/api/user-department/username/790241614973665283/'+usernameId)
}

// 获取用户职位
export function getUserPositionApi(usernameId:number): AxiosPromise<userDepartment[]>{
  return http.get('/usopp/api/user-position/username/790241614973665283/'+usernameId)
}

// 获取用户组织名称
export function getUserCompanyApi(): AxiosPromise<userCompany>{
  return http.get('/robin/company/790241614973665283')
}