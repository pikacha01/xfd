import { defineStore } from 'pinia'
import { getPermissionListApi,getClientInfoApi,getClientOwnerApi } from '@/api/modules/clientInfo'
import { stepUploadApi } from '@/api/modules/formInfo'
import { ref } from 'vue'
import { clienData,userInfo } from '@/constants/client'
import { IDUpload,newClientStep } from '@/constants/form'
import { useFormStore } from "@/store"

function formatDateTime(dateTimeStr) {
  const date = new Date(dateTimeStr);
  const year = date.getFullYear();
  const month = (`0${date.getMonth() + 1}`).slice(-2);
  const day = (`0${date.getDate()}`).slice(-2);
  const hour = (`0${date.getHours()}`).slice(-2);
  const minute = (`0${date.getMinutes()}`).slice(-2);
  const second = (`0${date.getSeconds()}`).slice(-2);
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}

// Tab栏对应的值
const tabStatus = {
  "全部": [{
    menuId: "790536182940565506",
    viewId :"797373861394317313"
  }],
  "预审": [{
    menuId: "790536182940565506",
    viewId :"797391751834271746"
    }],
  "踏勘": [{
    menuId: "790543924113244162",
    viewId :"797288173089816577"
  }, {
    menuId: "809721745403117570",
    viewId :"816567680016941057"
    }],
  "安装": [{
    menuId: "792597867579375617",
    viewId :"816627931633516545"
  }, {
    menuId: "792600569938870273",
    viewId :"792600570030522369"
    },{
    menuId: "792600569938870273",
    viewId :"821927870732959746"
    }],
  "并网": [{
    menuId: "792604618998415361",
    viewId :"792604619072372737"
  }, {
    menuId: "792604618998415361",
    viewId :"821952130852519938"
  }]
}

// 步骤的值
// 步骤 进度
const steps = {
  "草稿": 1.1,
  "踏勘": 2.1,
  "签约": 2.2,
  "银行初审": 2.3,
  "安装": 3.1,
  "自检": 3.2,
  "并网": 4.1,
  "验收": 4.2,
  "银行终审": 4.3,
  "放款成功": 4.4
}

export const useClientStore = defineStore("client-Store", () => {
  // 下拉选项和值
  const selectOption = ref<string>("")

  // 视图id
  const viewId = ref<string>("797373861394317313")

  // 状态筛选
  const statusFilter = ref<string[]>([])

  // 人员列表
  const userList = ref<clienData[]>([])
  let start = ref(0)
  let end = ref(30)
  let total = ref<number | null>(null)
  const search = ref<string>("")
  // 获取人员列表
  const getClientInfo = async () => {
    const formStore = useFormStore()
    console.log("请求时",statusFilter.value)
    const res = await getClientInfoApi(start.value, end.value,search.value,statusFilter.value)
    for (const item of res.datas) {
      item.DateField_4 = formatDateTime(item.DateField_4);
      // 客户拥有者
      if (item.MemberField_48 !== undefined) {
        const data = await getClientOwnerApi(item.MemberField_48[0]);
        // @ts-ignore
        item.owner = data.name;
      }
      // @ts-ignore
      formStore.formInfo?.children[7].children[2].items?.forEach(label => {
        if (item.GroupField_69 === label.value) {
          item.label = label.label
        }
      })
      userList.value.push(item);
    }
    total.value = res.total
    start.value = end.value
    end.value = (end.value + 30)
  }
  // 使他清0 start和end
  const startZero = () => {
    start.value = (0) 
    end.value = (30)
  }

 // Tab栏
  const TabList = ref<{
    text: string,
    value: string
  }[]>([{ text: "全部", value: "0" },
      { text: "预审", value: "0" },
      { text: "踏勘", value: "0" },
      { text: "安装", value: "0" },
      { text: "并网", value: "0" }])
  
  // 获取Tab栏总数量
  const getTabTotal = async () => {
    let tempList: any = []
    search.value = ""
    const formStore = useFormStore()
    for (const data of TabList.value) {
      if (data.text === "全部") {
        tempList = formStore.selectOption
      } else if (data.text === "预审") {
        formStore.selectOption.forEach(item => {
          if (item.text === "草稿") {
            tempList.push(item)
          }
        })
      } else if (data.text === "踏勘") {
        formStore.selectOption.forEach(item => {
          if (item.text === "踏勘" || item.text === "签约" || item.text === "银行初审") {
            tempList.push(item)
          }
        })
      } else if (data.text === "安装") {
        formStore.selectOption.forEach(item => {
          if (item.text === "安装" || item.text === "自检") {
            tempList.push(item)
          }
        })
      } else if (data.text === "并网") {
        formStore.selectOption.forEach(item => {
          if (item.text === "并网" || item.text === "验收" || item.text === "银行终审" || item.text === "放款成功") {
            tempList.push(item)
          }
        })
      }
      let filterList: any = []
      tempList.forEach(item => {
        filterList.push(item.value)
      })
      const res = await getClientInfoApi(start.value, end.value, search.value, filterList)
      filterList = []
      tempList = []
      data.value = String(res.total)
    }
  }
  
  // 身份证IDForm
  const IDCardForm = ref<userInfo>({
    DateField_4: null,
    JoinFormField_89: null,
    MemberField_3: null,
    MemberField_5: null,
    TextField_88: null,
    id: null,
    DateField_12: null,
    DateField_16: null,
    DateField_17: null,
    GroupField_13: null,
    IdentityField_15: null,
    MemberField_48: null,
    PhoneField_9: "",
    PositionField_67: null,
    RegionField_20: null,
    SelectField_58: null,
    TextField_1: null,
    TextField_76: null,
    TextField_21: null,
    TextField_84: null,
    TextField_87:null,
  })


  return {
    selectOption, getClientInfo, userList, total, end, start,IDCardForm,
    startZero,search,viewId,statusFilter,TabList,getTabTotal,steps}
  }
)