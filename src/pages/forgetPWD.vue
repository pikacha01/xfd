<template>
  <view class="icon">
    <image style="width: 280rpx;height: 120rpx;"  src="@/static/images/icon.jpg"></image>
  </view>
  <div class="uni-forms">
    <!-- label-position="top" -->
    <uni-forms validateTrigger="blur" ref="formRef" :model="model" 
    :border="true"
    >
      <uni-forms-item
        name="phone"
        label=""
        :rules="[
          {
            required: true,
            errorMessage: `手机号不能为空`,
          },
          {
            validateFunction: (rule, value) => {
              return smartPhoneValidator(rule, value);
            },
          },
        ]"
      >
        <uni-easyinput
          v-model="model.phone"
          placeholder="请输入手机号"
          maxlength="11"
          trim="all"
          :inputBorder="false"
          type="number"
        >
        </uni-easyinput>
      </uni-forms-item>
      <view v-show="isShowPopopup">
        <uni-forms-item
          label=""
        >
        <view class="code">
          <uni-easyinput
            v-model="codeStr"
            placeholder="图片验证码"
            maxlength="6"
            trim="all"
            :inputBorder="false"
            type="number"
          >
          </uni-easyinput>
            <view class="codePic" @click="changeCodeImg">
              <image :src="'data:image/png;base64,'+codeImg" style="width: 143px;height: 34px;"></image>
            </view>
        </view>
        </uni-forms-item>
      </view>
      <uni-forms-item
        :border="true"
        name="code"
        label=""
        :rules="[
          {
            required: true,
            errorMessage: `验证码不能为空`,
          },
        ]"
      >
      <view class="code">
        <uni-easyinput
            placeholder="请输入验证码"
            trim="all"
            :inputBorder="false"
            v-model="model.code"
          >
          </uni-easyinput>
          <view v-show="isSendCode" class="sendCodeNoActive" :class="{sendCode: codeStr?.length === 4}" @click="sendCode">发送验证码</view>
          <view v-show="!isSendCode" class="sendCodeNoActive">{{ countDownNum }}</view>
      </view>
      </uni-forms-item>
      <uni-forms-item
        :border="true"
        name="passWord"
        label=""
        :rules="[
          {
            required: true,
            errorMessage: `密码不能为空`,
          },
          {
            minLength: 6,
            maxLength: 20,
            errorMessage: '密码长度在6到20个字符',
          }
        ]"
      >
        <uni-easyinput
          placeholder="设置密码（6-20位字母数字组合）"
          trim="all"
          type="password"
          :inputBorder="false"
          v-model="model.passWord"
        >
        </uni-easyinput>
        <view class="borderLine"></view>
      </uni-forms-item>
      <button
        class="submit primary-button"
        :loading="isLoading"
        hover-class="primary-hover"
        @click="submit"
      >
        确定
      </button>
    </uni-forms>
  </div>
</template>
<script setup lang="ts">
import { userApi } from "@/api";
import { useCountStore, useClientStore } from "@/store";
import { smartPhoneValidator } from "@/utils/validate";
import { onReady } from "@dcloudio/uni-app";
import { reactive, ref,watch } from "vue";
import uniFormsItem from '@/uniComponents/uni-forms-item/uni-forms-item.vue'
import { checkUserApi,sendCodeApi,checkCodeImgApi } from '@/api/modules/userInfo'
import {onShareAppMessage } from '@dcloudio/uni-app'

onShareAppMessage(() => {
  return {
      title: '华福宝小程序',
      path: '/pages/login',
    }

})


const isLoading = ref(false)
// 弹出框
const isShowPopopup = ref(false)

const model = reactive({
  phone: "",
  passWord: "",
  code: ""
});

// 图形验证码
const codeStr = ref<string>("")
// 图片验证码图片
const codeImg = ref<string>()

// 是否发送验证码
const isSendCode = ref<boolean>(true)


//表单
const formRef = ref(null);

// 监听手机号码是否出现图片验证码
watch(() => {
  return model.phone
}, async () => {
  if (model.phone.length !== 11) return
  const test = /^1[3456789]\d{9}$/
  if(!test.test(model.phone)) return
  const checkUser = await checkUserApi(model.phone)
  //@ts-ignore
  if (checkUser.status !== 1) {
    uni.showToast({
      title: "用户不存在",
      icon: "error"
    })
    return 
  }
  changeCodeImg()
  isShowPopopup.value = true
})

// 获取验证码图片
const changeCodeImg = async () => {
  const img = await sendCodeApi(model.phone)
  //@ts-ignore
  codeImg.value = img.data
}

// 发送验证码
const sendCode = async () => {
  if(!isSendCode.value) return
  if(codeStr.value.length !== 4) return
  if(model.phone.length !== 11) return
  const checkUser = await checkUserApi(model.phone)
  //@ts-ignore
  if (checkUser.status !== 1) {
    uni.showToast({
      title: "用户不存在",
      icon: "error"
    })
    return 
  }
  const checkImgCode = await checkCodeImgApi(model.phone,codeStr.value)
  if (checkImgCode.status !== 0) {
    //@ts-ignore
    uni.showToast({ title: checkImgCode.msg, icon: "none" })
    return
  }
  isSendCode.value = false
  countDownNum.value = 60
  countDown()
}

let countDownTimer: any = null
const countDownNum = ref<number>(60)
// 倒计时
const countDown = () => {
  if (countDownNum.value <= 0) {
    clearTimeout(countDownTimer)
    countDownTimer = null
    isSendCode.value = true
    return 
  }
  countDownTimer = setTimeout(() => {
    countDownNum.value = countDownNum.value - 1
    countDown()
  }, 1000)
}

// 获取自定义的store
const store = useCountStore();

// 保存菜单选项
const clientStore = useClientStore()
onReady(() => {
  uni.setNavigationBarTitle({
    title: "忘记密码",
  });
});

const submit = () => {
  if(isLoading.value) return 
  //@ts-ignore
  formRef.value.validate().then(res => {
    isLoading.value = true
    userApi.getRsaPublicKey().then(res => {
      if (res.status == 0) {
        userApi.changePassword(res.data, model.phone, model.passWord,model.code).then(async res => {
          if (res.status == 0) {
            uni.showToast({ title: "修改密码成功" });
            uni.navigateTo({
              url: '/pages/login'
            })
            isLoading.value = false
          } else {
            uni.showToast({ title: res.msg, icon: "none" });
            model.passWord = "";
            isLoading.value = false
          }
        });
      }
    });
  });
};
</script>
<style scoped lang="scss">
.sendCodeNoActive {
  color: #A9A9A9;
}
.uni-forms {
  margin: 145rpx 55rpx 0;
  .submit {
    margin-top: 30px;
    background-color: #C7000B;
  }
}
.borderLine {
  width: 100%;
  height: 1px;
  background-color: #eee;
}
.forgetPWD {
  margin-top: 25rpx;
  font-size: 24rpx;
  color:#595757;
  width: 100%;
  display: flex;
  justify-content: flex-end;
}
.attention{
  width: 100%;
  margin-top: 400rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #A9A9A9;
  font-size: 24rpx;
  .agreement {
    color: #C7000B;
  }
}
.icon {
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  margin-top: 85rpx;
}
.sendCode {
  color: #C7000B;
  font-size: 28rpx;
}
.code {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .codePic {
    height: 34px;
    width: 143px;
  }
}
</style>
