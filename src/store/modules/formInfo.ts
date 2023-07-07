import { defineStore } from 'pinia'
import { ref } from 'vue'
import { clientFormInfoInfo,userInfo,clienData } from '@/constants/client'
import { newClientStep,IDUpload } from '@/constants/form'
import { geUserInfoDetailApi,getClientFormInfoApi,getNewClientApi,stepUploadApi,addUserValidateApi } from "@/api/modules/formInfo"

export const useFormStore = defineStore(
  "form-Store",
  () => {
  // 具体工作表信息
  const formInfo = ref<clientFormInfoInfo>()
  const selectOption = ref<{text: string,value: string}[]>([])
  // 获取信息
  const getClientFormInfo = async () => {
    const res = await getClientFormInfoApi()
    // @ts-ignore
    formInfo.value = res
    selectOption.value = []
    // @ts-ignore
    formInfo.value?.children[7].children[2].items?.forEach(item => {
      selectOption.value.push({text: item.label,value: item.value})
    })
  }

  // 新增人员 获取对应的步骤信息
  const newFormSteps = ref<newClientStep>()
  const getNewClient = async () => {
    const res = await getNewClientApi()
    //@ts-ignore
    newFormSteps.value = res
  }

    // 身份证上传
    const IDCardInfo = ref<IDUpload>({
      JoinFormField_89: null,
      PicField_43: [],
      PicField_44: [],
      TextField_87: ""
    })
    // 步骤更新 
    const stepUpload = async (userInfo:any) => {
      const res = await stepUploadApi(newFormSteps.value!.processId,newFormSteps.value!.stepId,userInfo)
      //@ts-ignore
      newFormSteps.value = res
    }
  
  // 表单验证
  const validateForm = async (formInfo:userInfo ) => {
    const res = await addUserValidateApi(newFormSteps.value!.processId,newFormSteps.value!.stepId,formInfo)
    return res
  }
  
  // 用户详情跳转
  const goUserDetailInfo = ref<clienData>()
  // 用户步骤
  const userCurrentStep = ref<number>()
  // 用户当前选中步骤
  const userSelectStep = ref<number>()
  // 获取用户当前选中的表信息
  const currentFormSteps = ref<newClientStep>()
  // 获取表单详情
  const getuserInfoStep = async () => {
    const res = await geUserInfoDetailApi(goUserDetailInfo.value!.id)
    //@ts-ignore
    newFormSteps.value = res
    //@ts-ignore
    currentFormSteps.value = res
  }
  
  // 合同签定表
  const contractForm = ref<newClientStep>()

  // 各个表改变的值
  const changeForm = ref<Object>({})

  //合同表的值
  const constractFieldForm = ref<Object>({})

  // 业务表步骤数
  const stepIndex = ref<number>(1)

  // 所有表单校验结果
  const allFormCheck = ref({})

  // 当前SN数量
  const SNCurrentTotal = ref<number>(0)

  return {
    getClientFormInfo,goUserDetailInfo, formInfo, selectOption, getNewClient, newFormSteps,stepUpload,IDCardInfo,validateForm,
    userCurrentStep,getuserInfoStep,userSelectStep,currentFormSteps,contractForm,changeForm,constractFieldForm,
    stepIndex,allFormCheck,SNCurrentTotal
  }
},{
  // @ts-ignore
  unistorage: true
})