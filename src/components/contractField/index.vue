<script setup lang="ts">
import { onMounted,ref,watch } from 'vue'
import { useFormStore } from '@/store'
import { getUserDetailStepAPi } from '@/api/modules/formInfo'
import uniDataSelect from '@/uniComponents/uni-data-select/uni-data-select.vue'

interface selectType {
  text: string,
  value: string
}

const formStore = useFormStore()

const formView =  {
  viewId: "792604619072372737",
  form: "JoinField_80"
}

// 购销合同
const saleStatus = ref<any>()
const saleValue = ref<any>()
const saleSelect = ref<selectType[]>()
// 运维合同
const operationStatus = ref<any>()
const operationValue = ref<any>()
const operationSelect = ref<selectType[]>()



onMounted(async () => {
  await formStore.getuserInfoStep()
  await getUserDetail()
})

// 获取对应的数据
const getUserDetail = async () => {
  const res = await getUserDetailStepAPi(formStore.newFormSteps!.processId,formStore.newFormSteps!.stepId,formView.form,formView.viewId)
  //@ts-ignore
  formStore.contractForm = res
  // 赋值
  saleStatus.value = formStore.contractForm?.data.inputForm.children[0].children[7]
  operationStatus.value = formStore.contractForm?.data.inputForm.children[0].children[8]
  saleValue.value = formStore.contractForm?.data.initData[saleStatus.value.id]
  operationValue.value = formStore.contractForm?.data.initData[operationStatus.value.id]
  saleSelect.value = saleStatus.value.items.map((item) => {
    return {
      text: item.label,
      value: item.value
    }
  })
  operationSelect.value = operationStatus.value.items.map((item) => {
    return {
      text: item.label,
      value: item.value
    }
  })
}

// 监听对应的数据改变
watch(()=>{
  return saleValue.value
}, () => {
  if(!saleValue.value.length) return
  formStore.contractForm!.data.initData.GroupField_22 = saleValue.value
})
watch(()=>{
  return operationValue.value
}, () => {
  if(!operationValue.value) return
  formStore.contractForm!.data.initData.GroupField_40 = operationValue.value
})

const preview = (fileLink) => {
  if (!fileLink) return
  console.log(fileLink)
  uni.showLoading({ title: '加载中' })
  uni.downloadFile({
    url: fileLink,
    success: function (res) {
      console.log(res, "wx.downloadFile success res")
      if (res.statusCode != 200) {
        uni.hideLoading()
        uni.showToast({
          title: "加载失败",
          icon: 'error',
          duration: 2000
        })
        return false
      }
      const path = res.tempFilePath
      uni.openDocument({
        filePath: path,
          //@ts-ignore
          showMenu: true,
          success: function (res) {
              console.log('打开成功');
              uni.hideLoading()
          }
      })
    }
  })
}
</script>

<template>
<view>
  <uni-forms ref="contractform"  :modelValue="formStore.contractForm?.data.initData" label-width="200rpx">
    <view class="title">
      <view class="left">3.1 合同签定</view>
    </view>
    <uni-forms-item :label="saleStatus.label" :required="saleStatus.readonly">
      <uni-data-select
        :disabled="saleStatus.readonly"
        v-model="saleValue"
        :localdata="saleSelect"
        placeholder="待发送合同"
        :clear="false"
      />
    </uni-forms-item>
    <uni-forms-item :label="operationStatus.label" :required="operationStatus.readonly">
      <uni-data-select
        :disabled="operationStatus.readonly"
        v-model="operationValue"
        :localdata="operationSelect"
        placeholder="待发送合同"
        :clear="false"
      />
    </uni-forms-item>
    <view class="pdfContent">
      <view class="left">
        <text>购销合同</text>
      </view>
      <view class="right">
        <image v-for="item in formStore.contractForm?.data.initData.FileField_42" :key="item.url" @click="preview(item.url)" class="icon" mode="widthFix" src="@/static/images/file_pdf.png"></image>
      </view>
    </view>
    <view class="pdfContent">
      <view class="left">
        <text>运维合同</text>
      </view>
      <view class="right">
        <image v-for="item in formStore.contractForm?.data.initData.FileField_43" :key="item.url" @click="preview(item.url)" class="icon" mode="widthFix" src="@/static/images/file_pdf.png"></image>
      </view>
    </view>
  </uni-forms>  
</view>
</template>

<style scoped lang="scss">
.title {
  font-weight: 400;
  display: flex;
  justify-content: space-between;
  color: #221815;
  line-height: 40rpx;
  height: 40rpx;
  font-size: 28rpx;
  padding: 30rpx 0;
}
.pdfContent{
  margin-bottom: 22px;
  display: flex;
  text-align: left;
  font-size: 14px;
  color: #606266;
  .left {
    width: 200rpx;
  }
  .right {
    flex: 1;
    display: flex;
    justify-content: flex-start;
    box-sizing: border-box;
    flex-wrap: wrap;
    .icon {
      margin-top: 10rpx;
      width: 33.33%;
    }
  }
}
</style>
