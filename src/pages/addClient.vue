<script setup lang="ts">
import {onMounted,watch} from 'vue'
import Steps from '@/components/steps/index.vue'
import IDForm from '@/components/IDCardForm/index.vue'
import {useFormStore,useClientStore} from '@/store'
import { onLoad } from "@dcloudio/uni-app"
import {onShareAppMessage } from '@dcloudio/uni-app'

onShareAppMessage(() => {
  return {
      title: '华福宝小程序',
      path: '/pages/login',
    }
})


const formStore = useFormStore()
const clientStore = useClientStore()

onLoad(() => {
  uni.setNavigationBarTitle({
    title: "新增农户"
  })
  // formStore.getNewClient()

  watch(() => {
    return clientStore.IDCardForm
  }, () => {
    //@ts-ignore
    wx.enableAlertBeforeUnload({
      message: "当前页面有未保存的数据，是否返回",
    })
  }, { deep: true })
})

onMounted(() => {
  formStore.IDCardInfo.PicField_43 = []
  formStore.IDCardInfo.PicField_44 = []
  clientStore.IDCardForm = {
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
  }
})  


</script>

<template>
  <view>
    <Steps :current-step="0" :select-step="0"></Steps>
    <view class="content">
      <IDForm ></IDForm>
    </view>
  </view>
</template>

<style scoped lang="scss">
.content {
  background-color: #f6f7f9;
  width: 100%;
}
</style>
