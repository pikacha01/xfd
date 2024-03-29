import http from '../http'
import { AxiosPromise } from "axios";
import { clientFormInfoInfo,userInfo,SNList } from '@/constants/client'
import { formTree,newClientStep,addressInfo,InverterList } from '@/constants/form'

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
export function getAddressDetailApi(address: number[]): AxiosPromise<addressInfo[]>{
  let tempAddress = `/roger/getAreaByIds/`
  address.forEach((item, index) => {
    if (index !== 0) {
      tempAddress = tempAddress + '-'
    } 
    tempAddress = tempAddress + item
  })
  return http.get(tempAddress)
  // return http.post(`/roger/getAreaByIds`, {ids:address})
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

// 获取逆变器配置
export function getInverterApi(id:string,stepId:string,userInfo:userInfo,start:number,end:number): AxiosPromise<InverterList[]>{
  return http.post(`/zoro/fetchJoinTableByCondition/790241614973665283/${id}/${stepId}/JoinFormField_80`, {
    userCondition: {
      start,
      end
    },
    value:userInfo
  })
}

// 获取表单详情
export function getUserDetailStepAPi(id: string, stepId: string, formID: string, viewId: string): AxiosPromise<newClientStep>{
  return http.post(`/zoro/start-detail-join/790241614973665283/${id}/${stepId}/${formID}`, {
    buttonId: "edit",
    menuId :  "",
    viewId 
  })
}

/**
 * 
 * @param buttonId 按钮ID
 * @param userIds 个人ID
 * @param viewId 视图ID
 * @returns 
 */
// 按钮请求
export function postButtonApi(buttonId: string, userIds: string,viewId:string,menuId:string ): AxiosPromise<newClientStep>{
  return http.post('/zoro/start-button/790241614973665283', {
    buttonId,
    selectedAll: false,
    selectedIds: [userIds],
    menuId,
    userCondition: {
    },
    viewId
  })
}

//SN码上传
export function upCodeStep(id:string,stepId:string): AxiosPromise<newClientStep>{
  return http.post(`/zoro/start-flowinnerflow/790241614973665283/${id}/${stepId}/ChildTableField_28
  `, {
    buttonId:"add",
    menuId: "",
    viewId: "796495087814901763"
  })
}

//SN码删除
export function deleteCodeStep(id:string,stepId:string,selectedId:string[]): AxiosPromise<newClientStep>{
  return http.post(`/zoro/start-flowinnerflow/790241614973665283/${id}/${stepId}/ChildTableField_28
  `, {
    buttonId:"delete",
    menuId: "",
    selectedAll: false,
    viewId: "796495087814901763",
    selectedIds: selectedId,
  })
}

// 获取sn码列表
export function getSNCodeList(id:string,stepId:string): AxiosPromise<SNList>{
  return http.post(`/zoro/joinList/790241614973665283/${id}/${stepId}/ChildTableField_28
  `, {
    buttonId:"add",
    menuId: "",
    viewId: ""
  })
}

// 获取关联表列表
export function getJoinForm(id:string,begin:number,end:number): AxiosPromise<any[]>{
  return http.post(`/zoro/form-datas/790241614973665283/${id}
  `, {
    begin,
    end,
    keyword: ""
  })
}
