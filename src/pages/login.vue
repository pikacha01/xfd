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
        <view class="borderLine"></view>
        </uni-easyinput>
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
          placeholder="密码"
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
        登录
      </button>
    </uni-forms>
    <view class="forgetPWD" @click="gotoForgetPWD">忘记密码？</view>
  </div>
  <view class="wxlogin">
    <view class="elseLogin">
      <view class="sperate"></view>
      <view class="content">其他方式登录</view>
      <view class="sperate"></view>
    </view>
    <view class="wx" @click="getPhoneNumber">
      <view>
        <image mode="aspectFill" class="wxImg" src="@/static/images/wxlogo.jpg"></image>
      </view>
      <view class="wxText">微信登录</view>
    </view>
  </view>
  <view class="attention" >点击登录表示同意<text class="agreement" @click="gotoUser">《用户协议》</text>和<text class="agreement" @click="gotoAgreement">《隐私协议》</text></view>
</template>
<script setup lang="ts">
import { userApi } from "@/api";
import { useCountStore, useClientStore,useUserStore } from "@/store";
import { smartPhoneValidator } from "@/utils/validate";
import { onReady } from "@dcloudio/uni-app";
import { reactive, ref } from "vue";
import { generateUUID } from '@/utils/webSocket'
import uniFormsItem from '@/uniComponents/uni-forms-item/uni-forms-item.vue'
import { connectmqtt } from '@/utils/webSocket'

const userStore = useUserStore()

const isLoading = ref(false)

const model = reactive({
  phone: "",
  passWord: "",
});
const formRef = ref(null);
// 获取自定义的store
const store = useCountStore();

// 保存菜单选项
onReady(() => {
  uni.setNavigationBarTitle({
    title: "登录",
  });
});

// 跳转忘记密码页面
const gotoForgetPWD = () => {
  uni.navigateTo({
    url: '/pages/forgetPWD'
  })
}

const submit = () => {
  if(isLoading.value) return 
  //@ts-ignore
  formRef.value.validate().then(res => {
    isLoading.value = true
    userApi.getRsaPublicKey().then(res => {
      if (res.status == 0) {
        userApi.getToken(res.data, model.phone, model.passWord).then(async res => {
          if (res.status == 0) {
            uni.showToast({ title: "登录成功" });
            const { access_token } = res.data.map;
            const token = `Bearer ${access_token}`;
            store.$patch(v => (v.token = token));
            await userStore.getUserInfo()
            const uuid = generateUUID()
            userStore.uuid = uuid;
            await connectmqtt()
            uni.navigateTo({
              url: 'index/index'
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

// 用户协议
const gotoUser = () => {
  uni.navigateTo({
    url: '/pages/userAgreement'
  })
}

// 用户隐私
const gotoAgreement = () => {
  uni.navigateTo({
    url: '/pages/privacy'
  })
}

// 获取手机号码
const getPhoneNumber = () => {
  uni.showToast({
    title: "功能开发中",
    icon: "error",
    duration: 2000
  });
  // uni.login({
  //   success: (res) => {
  //     if (res.code) {
  //       console.log(res.code)
  //     }
  //   }
  // })
}
</script>
<style scoped lang="scss">
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
  margin-top: 90rpx;
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
.wxlogin{
  margin: 250rpx 55rpx 0;
  .elseLogin {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 34rpx;
    .sperate {
      flex: 1;
      height: 2rpx;
      border: 2rpx solid #E9E9E9;
      background-color: #E9E9E9;
    }
    .content {
      font-size: 24rpx;
      line-height: 34rpx;
      padding: 0 32rpx;
      color: #A9A9A9;
    }
  }
  .wx { 
    margin-top: 30rpx;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .wxImg { 
      width: 76rpx;
      height: 76rpx;
    }
    .wxText { 
      display: flex;
      justify-content: center;
      align-items: center;
      color: #A9A9A9;
      font-size: 24rpx;
    }
  }
}
</style>
