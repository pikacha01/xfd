import http from '../http'
import HWCloud from '../huaweiClound'
import { clienData,tabsList,clientOwner,obs } from '@/constants/client'
import { AxiosPromise } from "axios";
import { IDUpload,newClientStep,Condition,Operator } from '@/constants/form'


// 获取客户信息
export function getClientInfoApi(start:number,end:number,criterias:Condition[]): Promise<{
  datas: clienData[],
  end:number,
  start: number,
  total:number
}> {
  if (criterias && criterias.length > 0) {
    return http.post('/zoro/pagedList/790241614973665283',{
      menuId: "790536182940565506",
      viewId: "797373861394317313",
      buttonId: "fetch",
      selectedAll: false,
      selectedIds: [],
      userCondition: {
        end,
        sort: [],
        start,
        operator: "AND",
        criterias
      }
    })
  } else {
    return http.post('/zoro/pagedList/790241614973665283',{
      menuId: "790536182940565506",
      viewId: "797373861394317313",
      buttonId: "fetch",
      selectedAll: false,
      selectedIds: [],
      userCondition: {
        end,
        sort: [],
        start,
      }
    })
  }
 
}

// 获取权限的视图列表
export function getPermissionListApi(): AxiosPromise<tabsList[]> {
  return http.get('/nami/role/role_view_list/790241614973665283/790536127005163522/790536182940565506')
}

// 获取客户拥有者
export function getClientOwnerApi(id:string | number): AxiosPromise<clientOwner>{
  return http.get('/robin/api/users/' + id)
}

// 获取用户部门管理
export function getClientDepApi(username: string): AxiosPromise{
  return http.get("/usopp/api/user-department/username/790241614973665283/"+username)
}

// 获取OBS地址
export function getObsApi(): AxiosPromise<obs>{
  return http.get("/bepo/obs/get_config")
}

// 身份证图片上传
// 获取当前城市天气
export const putImage = (url:string,formID:string | number,file: File) => {
  return HWCloud(`${url}/formID`,"PUT")
}
 
