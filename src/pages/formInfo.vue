<script setup lang="ts">
import {onMounted,ref,defineAsyncComponent} from 'vue'
import { useFormStore,useClientStore } from "@/store"
import Steps from '@/components/steps/index.vue'
import FormGrid from '@/components/FormGrid/index.vue'
import TextField from '@/components/inputField/index.vue'
import DateField from '@/components/DateInput/index.vue'
import GroupField from '@/components/PickerSelect/index.vue'
import IDField  from '@/components/IDField/index.vue'
import RegionField from '@/components/RegionInput/index.vue'
import IDDateEnd  from '@/components/IDDateEnd/index.vue'
import PositionField  from '@/components/PositionComponent/index.vue'
import JoinFormField  from '@/components/JoinFormField/index.vue'
import PicField  from '@/components/ImgField/index.vue'
import { getUserDetailStepAPi } from '@/api/modules/formInfo'
import { newClientStep } from '@/constants/form'
import constractField from '@/components/contractField/index.vue'
import FileField from '@/components/FileInput/index.vue'
import ChildTableField from '@/components/ChildField/index.vue'


const formStore = useFormStore()
const clientStore = useClientStore()

//校验规则
const idFormRules = {
  // 手机号码 
  PhoneField_9: {
    rules: [{
      format: 'string',
      required: true,
      errorMessage: '请输入手机号码',
      validateTrigger: "blur"
    }, {
      validateFunction: function (rule, value, data, callback) {
        return new Promise((resolve, reject) => {
          if (!/^1[3456789]\d{9}$/.test(value)) {
            reject(new Error('手机号码输入错误'))
          }
          //@ts-ignore
          resolve()
        })
      }
    }]
  },
  // 身份证号码验证
  IdentityField_15: {
    rules: [{
      format: 'string',
      validateTrigger: "blur"
    }, {
      validateFunction: function(rule, value, data, callback) {
        return new Promise((resolve, reject) => {
          if (!/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value)) {
            reject(new Error('身份证号码输入错误'))
          }
          //@ts-ignore
          resolve()
        })
      }
    }]
  },
  // 地区选择
  RegionField_20: {
    rules: [{
      required: true,
      errorMessage: '地区不能为空'
    }]
  }

}


// 处理inputForm成数组
const inputFormChangeArray = (node) => {
  let result = [node];
  if (node.children) {
    for (let child of node.children) {
      result = result.concat(inputFormChangeArray(child));
    }
    delete node.children;
  }
  return result;
}

const inputFormArray = ref()

onMounted(async () => {
  uni.setNavigationBarTitle({
    title: formStore.goUserDetailInfo!.TextField_1
  })
  uni.setNavigationBarColor({
    frontColor: '#000000',
    backgroundColor: '#ffffff'
  })
  await getFormInfo()
})

// 获取表单详情
const getFormInfo = async () => {
  currentStepFormData.value = []
  await formStore.getuserInfoStep()
  if (Math.floor(formStore.userSelectStep!) !== 1) {
    for (const key of formStep[Math.floor(formStore.userSelectStep!)]) {
      const res = await getUserDetailStepAPi(formStore.newFormSteps!.processId,formStore.newFormSteps!.stepId,key.form,key.viewId)
      //@ts-ignore
      formStore.currentFormSteps = res
      // currentStepFormData.value.push(res)
      // console.log(currentStepFormData.value)
    }
  }
  inputFormArray.value = inputFormChangeArray(formStore.currentFormSteps!.data.inputForm)
}

// 当前页面表单数据
const currentStepFormData = ref<newClientStep[]>([])

// 改变步骤
const changeStep = (index: number) => {
  formStore.userSelectStep = index + 1
  getFormInfo()
}

// 每个步骤对应的表单
const formStep = {
  1: "_this",
  2: [
    {
      viewId: "797373861394317313",
      form: "JoinField_59"
    },
  ],
  3: [
    { 
      viewId: "790599731258425345",
      form: "JoinFormField_73"
    }
  ],
  4: [
    {
      form: "JoinFormField_75",
      viewId: "796495087814901763"
    }
  ]
}

</script>

<template>
  <view class="header">
    <view class="title">
      <view class="content">兴伏贷</view>
      <view class="currentStep">{{formStore.goUserDetailInfo?.label}}</view>
    </view>
    <view class="date">
      <view class="number">客户编号：<span>{{ formStore.goUserDetailInfo?.AutoNumberField_55 }}</span></view>
      <view class="time">{{ formStore.goUserDetailInfo?.DateField_4 }}</view>
    </view>
  </view>
  <Steps @change-step="changeStep" :select-step="Math.floor(formStore.userSelectStep!)-1"  :current-step="Math.floor(formStore.userCurrentStep!)-1"></Steps>
  <view class="FormContent">
    <uni-forms ref="IDform" :rules="idFormRules"  :modelValue="formStore.currentFormSteps?.data.initData" label-width="200rpx">
    <view class="content">
      <view v-for="item in inputFormArray"
        :key="item.id">
        <template v-if="item.tag === 'TextField' || item.tag === 'IdentityField' || item.tag === 'NumberField'">
          <TextField :data="item"></TextField>
        </template>
        <template v-else-if ="item.tag === 'FormGrid'">
          <FormGrid :data="item" :step="Math.floor(formStore.userCurrentStep!)"></FormGrid>
        </template>
        <template v-else-if ="item.tag === 'PhoneField'">
          <TextField :data="item"></TextField>
        </template>
        <template v-else-if ="item.tag === 'DateField' &&  item.id === 'DateField_17'">
          <IDDateEnd :data="item"></IDDateEnd>
        </template>
        <template v-else-if ="item.tag === 'DateField'">
          <DateField :data="item"></DateField>
        </template>
        <template v-else-if ="item.tag === 'GroupField'">
          <GroupField :data="item"></GroupField>
        </template>
        <template v-else-if ="item.tag === 'PicField' && item.id === 'PicField_43'">
          <IDField :data="item"></IDField>
        </template>
        <template v-else-if ="item.tag === 'RegionField'">
          <RegionField :data="item"></RegionField>
        </template>
        <template v-else-if ="item.tag === 'PositionField'">
          <PositionField :data="item"></PositionField>
        </template>
        <template v-else-if ="item.id === 'JoinFormField_80'">
          <JoinFormField :data="item"></JoinFormField>
        </template>
        <template v-else-if ="item.tag === 'PicField' && item.id !== 'PicField_44'">
          <PicField :data="item"></PicField>
        </template>
        <template v-else-if ="item.tag === 'FileField'">
          <FileField :data="item"></FileField>
        </template>
        <template v-else-if ="item.tag === 'ChildTableField'">
          <ChildTableField :data="item"></ChildTableField>
        </template>
      </view>
    </view>
		</uni-forms>  
    <template v-if="Math.floor(formStore.userSelectStep!) === 2">
      <view class="content">
        <constractField />
      </view>
    </template>
  </view> 
</template>

<style scoped lang="scss">
.title {
  margin: 16rpx 32rpx 16rpx;
  height: 60rpx;
  background-color: #F0F0F0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .content {
    color: #595757;
    font-size: 24rpx;
    padding: 0rpx 24rpx;
  }
  .currentStep {
    padding: 0 24rpx;
    color: #C7000B;
    font-weight: 500;
    font-size: 28rpx;
  }
}
.date {
  margin: 16rpx 32rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 34rpx;
  font-size: 24rpx;
  .number {
    color: #595757;
    span {
      color:#221815;
    }
  }
  .time {
    color: #A9A9A9;
  }
}
.FormContent {
  margin-bottom: 25rpx;
  background-color: #f6f7f9;
  .content {
    margin: 24rpx 32rpx;
  }
}
</style>
