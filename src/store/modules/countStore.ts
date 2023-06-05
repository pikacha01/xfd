import { IfCompany, IfDataItem } from '@/constants/form'
import { defineStore } from 'pinia'

export  const useCountStore = defineStore('storeId', {
  // arrow function recommended for full type inference
  unistorage: true, // 是否持久化
  state: () => ({
    // all these properties will have their type inferred automatically
    FormGrid: [] as Array<IfDataItem>,
    token: "",
    value: new Map(),
    companyId: "",
    companyInfo:{} as IfCompany,
    formId: "",
    html: "",//富文本内容
  }),
  actions: {
    synIncrease() {
      // this.count += 1
    },
    async asyncIncrease() {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      // this.count += 1
    }
  }
})

