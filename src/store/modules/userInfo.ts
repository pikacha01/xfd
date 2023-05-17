import { defineStore } from 'pinia'
import { getUserCompanyApi,getUserNameApi,getUserDepartmentApi,getUserPositionApi } from '@/api/modules/userInfo'
import { ref } from 'vue'
import {userName,userDepartment,userCompany} from '@/constants/user'

export const useUserStore = defineStore("user-Store", () => {
  // 用户个人信息
  const userInfo = ref<userName>()
  //部门信息
  const deparmtmentInfo = ref<userDepartment[]>([])
  // 职位信息
  const positionInfo = ref<userDepartment[]>([])
  // 获取个人信息
  const getUserInfo = async () => {
    const userData = await getUserNameApi()
    // @ts-ignore
    const departData = await getUserDepartmentApi(userData.id)
    // @ts-ignore
    const positionData = await getUserPositionApi(userData.id)
    // @ts-ignore
    userInfo.value = userData
    // @ts-ignore
    deparmtmentInfo.value = departData
    // @ts-ignore
    positionInfo.value = positionData
  }

  // 组织信息
  const companyInfo = ref<userCompany>()
  // 获取组织信息
  const getCompany = async () => {
    const data = await getUserCompanyApi()
    // @ts-ignore
    companyInfo.value = data
  }
  return {
    getUserInfo,userInfo,deparmtmentInfo,positionInfo,getCompany,companyInfo
  }
},{
  // @ts-ignore
  unistorage: true
})