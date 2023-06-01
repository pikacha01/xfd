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
  formStore.constractFieldForm["GroupField_22"] = saleValue.value
})
watch(()=>{
  return operationValue.value
}, () => {
  if(!operationValue.value) return
  formStore.contractForm!.data.initData.GroupField_40 = operationValue.value
  formStore.constractFieldForm["GroupField_40"] = operationValue.value
})

const preview = (fileLink) => {
  if (!fileLink) return
  console.log(fileLink)
  uni.showLoading({ title: '加载中' })
  uni.downloadFile({
    url: fileLink,
    success: function (res) {
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
              uni.hideLoading()
          }
      })
    }
  })
}

// 拉伸和收缩
const isShow = ref<boolean>(true)

// 展示更多
const showMore = () => {
  isShow.value  = !isShow.value
}
</script>

<template>
<view>
  <uni-forms ref="contractform"  :modelValue="formStore.contractForm?.data.initData" label-width="200rpx">
    <view class="title" @click="showMore">
      <view class="left">3.1 合同签定</view>
      <view class="right">
      <uni-icons type="top" size="22" v-if="isShow"></uni-icons>
      <uni-icons type="bottom" size="22" v-else></uni-icons>
    </view>
    </view>
    <view class="showInfo" :class="[isShow ? '' : 'hiddenInfo']">
      <uni-forms-item :label="saleStatus.label" :required="saleStatus.readonly">
      <uni-data-select
        :disabled="saleStatus.readonly || (Object.entries(formStore.contractForm!.data.initData).length === 0)"
        v-model="saleValue"
        :localdata="saleSelect"
        placeholder="待发送合同"
        :clear="false"
      />
    </uni-forms-item>
    <uni-forms-item :label="operationStatus.label" :required="operationStatus.readonly">
      <uni-data-select
        :disabled="operationStatus.readonly || (Object.entries(formStore.contractForm!.data.initData).length === 0)"
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
  font-weight: 700;
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
.showInfo {
  width:100%;
  animation: expand 0.5s;
}
.hiddenInfo {
  overflow: hidden;
  height: 0;
}
@keyframes expand {
  from {
    height: 0;
  }
  to {
    height: 200px;
  }
}
</style>
