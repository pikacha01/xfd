<script setup lang="ts">
import {onMounted,ref,computed } from 'vue'
import { useFormStore,useUserStore } from "@/store"
import Steps from '@/components/steps/index.vue'
import FormGrid from '@/components/FormGrid/index.vue'
import guidence from '@/components/Guidence/index.vue'
import constractField from '@/components/contractField/index.vue'
import { getUserDetailStepAPi } from '@/api/modules/formInfo'
import { newClientStep } from '@/constants/form'
import { onShow, onHide } from "@dcloudio/uni-app";
import { postButtonApi,stepUploadApi } from '@/api/modules/formInfo'

onShow(() => {
  // uni.connectSocket({
  //   url: 'wss://zhuyiyun.com/mqtt',
  //   success: (()=> {
  //     uni.onSocketOpen(function (res) {
  //       console.log('WebSocket连接已打开！');
  //       uni.onSocketMessage(function (res) {
  //         console.log('收到服务器内容：' + res.data);
  //       });
  //     });
  //   })
  // });
 
});

const formStore = useFormStore()
const userStore = useUserStore()

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

const inputFormArray = ref<any>([])

onMounted(async () => {
  formStore.stepIndex  =  1
  // 改变的值为归为空数组
  formStore.changeForm = {}

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
  uni.showLoading({title:"加载中"})
  currentStepFormData.value = []
  await formStore.getuserInfoStep()
  if (Math.floor(formStore.userSelectStep!) !== 1) {
    for (const key of formStep[Math.floor(formStore.userSelectStep!)]) {
      const res = await getUserDetailStepAPi(formStore.newFormSteps!.processId,formStore.newFormSteps!.stepId,key.form,key.viewId)
      //@ts-ignore
      formStore.currentFormSteps = res
      // currentStepFormData.value.push(res)
    }
  }
  if (formStore.currentFormSteps!.data.inputForm === undefined) {
    inputFormArray.value = []
  } else {
    inputFormArray.value = formStore.currentFormSteps!.data.inputForm.children
  }
  uni.hideLoading();
}

// 当前页面表单数据
const currentStepFormData = ref<newClientStep[]>([])

// 改变步骤
const changeStep = async (index: number) => {
  formStore.changeForm = {}
  formStore.userSelectStep = index + 1
  formStore.stepIndex  =  1
  await getFormInfo()
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
      viewId: "810917561500073985",
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

// 按钮列表
const buttonsList = {
  // 征信查询
  "草稿": {
    buttonId: "798189658066092035",
    viewId: "797391751834271746"
  },
  "踏勘": {
    buttonId: "792802926181580801",
    viewId: "792522818534965249"
  },
  "提交审核": {
    buttonId: "797346147391209473",
    viewId: "790599731258425345"
  },
  // 签约购销协议
  "buy": {
    buttonId: "810920227109928961",
    viewId: "810917561500073985"
  },
  // 签约运维协议
  "operation": {
    buttonId: "811713355155210242",
    viewId: "810917561500073985"
  },
  "安装自检完成": {
    buttonId: "869823621114658817",
    viewId: "796495087814901763"
  },
  "并网完成": {
    buttonId: "821958840828592130",
    viewId: "792604619072372737"
  }

} 

// 按钮查询
const getButton = async (buttonId:string,viewId:string) => {
  await postButtonApi(buttonId,String(formStore.currentFormSteps!.data.initData.id),viewId)
}

// 保存表单
const saveForm = async () => {
  if (Object.entries(formStore.changeForm).length === 0) {
    uni.showToast({ title: "暂无修改", icon: "none" });
    return
  }
  formStore.changeForm['id'] = formStore.goUserDetailInfo!.id
  try {
    await stepUploadApi(formStore.currentFormSteps!.processId,formStore.currentFormSteps!.stepId,formStore.changeForm)
  } catch (error) {
    uni.showToast({ title: "保存失败", icon: "error" });
    return 
  }
  uni.showToast({ title: "保存成功" });
}

const Form = ref(null)

// 每一个步骤的文字
const textList = ["保存信息并进入征信查询，若通过将自动进入踏勘环节！是否确定？","保存信息并提交审核！是否确定？","确定是否安装自检完成？","确定是否并网？"]
//保存并提交表单
const saveSubmitForm = () => {
   //@ts-ignore
  Form.value.validate().then(async res => {
    uni.showModal({
    title: '提示',
    content: textList[Math.floor(formStore.userSelectStep!)-1],
    confirmColor: "#C7000B",
    success: async function (res) {
      if (res.confirm) {
        if (Object.entries(formStore.changeForm).length !== 0) { 
          formStore.changeForm['id'] = formStore.currentFormSteps?.data.initData.id
          await stepUploadApi(formStore.currentFormSteps!.processId,formStore.currentFormSteps!.stepId,formStore.changeForm)
        } 
        if (Math.floor(formStore.userSelectStep!) === 1) {
          await checkCrediGo()
        } else if (Math.floor(formStore.userSelectStep!) === 2) {
          await submitReview()
        } else if (Math.floor(formStore.userSelectStep!) === 3) {
          if (formStore.newFormSteps?.data.initData.TextField_78 !== "审批通过") {
            uni.showToast({
              title: '银行审核未通过',
              icon: 'error',
              duration: 2000
            })
            return
          } else {
            await complete()
          }
        } else if (Math.floor(formStore.userSelectStep!) === 4) {
          await UtilityGridConnect()
        }
      } else if (res.cancel) {
        uni.showToast({
          title: '取消退出',
          icon: 'none',
          duration: 2000
        })
      }
      }
    });
  })
}

// 检查征信并进入踏勘
const checkCrediGo = async () => {
  uni.showLoading({ title: '验证中' })
  if (formStore.currentFormSteps?.data.initData["GroupField_70"] === "2") {
    const { buttonId, viewId } = buttonsList["踏勘"]
    await getButton(buttonId,viewId)
    formStore.userSelectStep = formStore.userSelectStep! + 1 
    await getFormInfo()
    uni.hideLoading()
    uni.showToast({
      title: "已进入下一步",
    })
  } else {
    const { buttonId,viewId }  = buttonsList["草稿"]
    await getButton(buttonId,viewId)
    await getFormInfo()
    if (formStore.currentFormSteps?.data.initData["GroupField_70"] === "2") {
      const { buttonId, viewId } = buttonsList["踏勘"]
      await getButton(buttonId,viewId)
      formStore.userSelectStep = formStore.userSelectStep! + 1 
      await getFormInfo()
      uni.hideLoading()
      uni.showToast({
        title: "已进入下一步",
      })
    } else {
      uni.hideLoading()
      uni.showToast({
        title: "审核未通过",
        icon: "error"
      })
    }
  }
}

// 提交审核
const submitReview = async () => {
  uni.showLoading({ title: '提交信息中' })
  const { buttonId,viewId }  = buttonsList["提交审核"]
  await getButton(buttonId, viewId)
  uni.hideLoading()
  uni.showToast({
    title: '已提交审核',
    icon: 'success',
    duration: 2000
  })
}

// 完成安装自检完成
const complete = async () => {
  const { buttonId,viewId }  = buttonsList["安装自检完成"]
  await getButton(buttonId, viewId)
  uni.showToast({
    title: '已提交安装自检',
    icon: 'success',
    duration: 2000
  })
}



// 并网
const UtilityGridConnect = async () => {
  const { buttonId,viewId }  = buttonsList["并网完成"]
  await getButton(buttonId, viewId)
  uni.showToast({
    title: '已提交并网完成',
    icon: 'success',
    duration: 2000
  })
}

// 是否展示按钮
const isShowButtons = computed(() => {
  if (buttonIsShow[Math.floor(formStore.userSelectStep!)].value.includes(formStore.currentFormSteps?.data.initData[buttonIsShow[Math.floor(formStore.userSelectStep!)].name])) {
    return true
  }
  return false
})

// 展示按钮对象
const buttonIsShow = {
  1: {
    name: "GroupField_70",
    value: ["1","3","4"]
  },
  2: {
    name: "GroupField_47",
    value: ["1","4"]
  },
  3: {
    name: "GroupField_25",
    value: ["1"]
  },
  4 : {
    name: "GroupField_28",
    value: ["1","4"]
  }
}


// 签约合同
const signContract = (type:string) => {
  const { buttonId, viewId } = buttonsList[type]
  uni.showModal({
    title: '提示',
    content: "是否发送协议",
    confirmColor: "#C7000B",
    success: async function (res) {
      if (res.confirm) {
        uni.showLoading({ title: '发送合同中' })
        await postButtonApi(buttonId, String(formStore.contractForm!.data.initData.id), viewId)
        uni.hideLoading()
      } else if (res.cancel) {
        uni.showToast({
          title: '取消退出',
          icon: 'none',
          duration: 2000
        })
      }
      }
    });
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
    <uni-forms ref="Form" :border="true" :rules="idFormRules"  :modelValue="formStore.currentFormSteps?.data.initData" label-width="200rpx">
    <view class="content">
      <view v-for="(item,index) in inputFormArray"
        :key="item.id">
        <template v-if ="item.tag === 'FormGrid' && item.label !== '所属业务员'">
          <FormGrid :data="item" :step="Math.floor(formStore.userSelectStep!)"
            :index="index" :component-list="item.children"
          >
          </FormGrid>
        </template>

      </view>
    </view>
		</uni-forms>  
    <template v-if="Math.floor(formStore.userSelectStep!) === 2">
      <view class="content">
        <constractField />
      </view>
    </template >
    <template v-if="Math.floor(formStore.userSelectStep!) === 1"> 
      <guidence :credit="formStore.currentFormSteps?.data.initData['GroupField_70'] === '2'"></guidence>
    </template>
    <view class="buttons" v-if="isShowButtons">
      <view class="save" @click="saveForm">
        保存
      </view>
      <view class="submit" @click="saveSubmitForm">
        保存并提交
      </view>
    </view>
    <view class="buttons" v-if="Math.floor(formStore.userSelectStep!) === 2 &&
    (formStore.contractForm?.data.initData['GroupField_22'] ===  '1' || formStore.contractForm?.data.initData['GroupField_40'] ===  '1')">
      <view class="submit" @click="signContract('buy')" 
        v-if="Object.entries(formStore.contractForm?.data.initData).length !== 0 && formStore.contractForm?.data.initData['GroupField_22'] ===  '1'">
        签约购销协议
      </view> 
      <view class="submit" @click="signContract('operation')"
      v-if="Object.entries(formStore.contractForm?.data.initData).length !== 0 && formStore.contractForm?.data.initData['GroupField_40'] ===  '1'"
      >
        签约运维协议
      </view>
    </view>
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
.buttons {
  height: 245rpx;
  width: 100%;
  display: flex;
  padding: 48rpx 96rpx 0;
  justify-content: space-between;
  box-sizing: border-box;
  .save {
    width: 240rpx;
    height: 80rpx;
    border-radius: 4rpx;
    border: 2rpx solid #221815;
    color: #221815;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .submit {
    width: 240rpx;
    height: 80rpx;
    color:#FFFFFF;
    background: #C7000B;
    border-radius: 4rpx;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
