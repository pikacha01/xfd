import http from '../http'
import { AxiosPromise } from "axios";
import { clientFormInfoInfo,userInfo } from '@/constants/client'
import { formTree,newClientStep,addressInfo } from '@/constants/form'

// 获取具体工作表信息
export function getClientFormInfoApi(): AxiosPromise<clientFormInfoInfo>{
  return http.get('/bepo/form/790241614973665283/790536175480963074')
}

// 获取应用内所有菜单(树形)
export function getMenuTreeApi(): AxiosPromise<formTree>{
  return http.get('/nami/menuTree/790241614973665283/790536127005163522')
}

//新增按钮获取对应信息
export function getNewClientApi(): AxiosPromise<newClientStep>{
  return http.post('/zoro/start-button/790241614973665283', {
    buttonId: "846046775370481667",
    menuId: "790536182940565506",
    selectedAll: false,
    selectedIds: [],
    userCondition:{},
    viewId: "797391751834271746"
  })
}

// 步骤更新
export function stepUploadApi(id:string,stepId:string,userInfo:any): AxiosPromise<newClientStep> {
  return http.post(`zoro/user-input/790241614973665283/${id}/${stepId}`, {value:userInfo})
}

// 添加用户校验
export function addUserValidateApi(id:string,stepId:string,userInfo:userInfo): AxiosPromise {
  return http.post(`/zoro/validate/790241614973665283/${id}/${stepId}/IdentityField_15`, {value:userInfo})
}

// 获取地理位置 
export function getAddressDetailApi(address: number[]):AxiosPromise<addressInfo[]>{
  return http.post(`/roger/getAreaByIds`, {ids:address})
}

// 获取表单详情
export function geUserInfoDetailApi(userID: number): AxiosPromise<newClientStep> {
  return http.post(`/zoro/start-dateil/790241614973665283/790536175480963074`, {
    buttonId: "797373862254542849",
    menuId: "790536182940565506",
    selectedIds:[userID],
    viewId: "797373861394317313"
  })
}
