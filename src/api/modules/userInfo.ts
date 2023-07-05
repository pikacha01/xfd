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

// 订阅WebSocket 
export function subWebSocket(ID: string): AxiosPromise{
  return http.get('/sabot/emqx/autoSubscribe/' + ID)
}

// 用户是否存在 
export function checkUserApi(phone: string): AxiosPromise<{status:number}>{
  return http.get('/robin/api/check_users/' + phone)
}

// 获取图片验证码
export function sendCodeApi(phone: string): AxiosPromise<{data:string}>{
  return http.get('/robin/api/verifyImg/' + phone)
}

// 图片验证码校验
export function checkCodeImgApi(phone: string,code:string): AxiosPromise<{msg:string,status: number}>{
  return http.get(`/robin/api/sendVerifyCode/${phone}/${code}`)
  // return http.post(`/robin/api/sendVerifyCode/${phone}/${code}`)
}