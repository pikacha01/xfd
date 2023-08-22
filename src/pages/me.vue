<script setup lang="ts">
import { useUserStore,useCountStore,useClientStore } from '@/store'
import {onMounted,ref} from 'vue'
import { disConnection } from '@/utils/webSocket'

const clientStore = useClientStore()
const userStore = useUserStore()

// 获取自定义的store
const store = useCountStore();

const Dialog = ref<any>(null);

onMounted(() => {
  userStore.getCompany()
})


// 退出登录
const loginOut = () => {
  uni.showModal({
    title: '提示',
    content: '是否要退出登录？',
    confirmColor: "#C7000B",
    success: function (res) {
        if (res.confirm) {
          store.$patch(v => (v.token = ''))
          store.$patch(v => (v.refreshToken = ''))
          disConnection()
          clientStore.userList = []
          clientStore.TabList = [{ text: "全部", value: "0" },
      { text: "预审", value: "0" },
      { text: "踏勘", value: "0" },
      { text: "安装", value: "0" },
      { text: "并网", value: "0" }]
          uni.redirectTo({
            url: '/pages/login'
          })
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
  <view class="body">
    <view class="content">
      <view class="infoHeader">
        <view class="avator">
          <image :src="userStore.userInfo?.avatar"></image>
        </view>
        <view class="info">
          <view class="name">{{ userStore.userInfo?.name }}</view>
          <view class="company">{{ userStore.companyInfo?.name }}</view>
        </view>
      </view>
      <view class="sperate" style="margin-top: 60rpx;"></view>
      <view class="phone">
        <view class="label">手机</view>
        <view class="phoneNumber">{{ userStore.userInfo?.phone }}</view>
      </view>
      <view class="sperate"></view>
      <view class="department">
        <view class="label">部门</view>
        <scroll-view scroll-x="true" style="white-space: nowrap;" class="tagList">
          <view class="tag" v-for="item in userStore.deparmtmentInfo" :key="item.id">{{ item.name }}</view>
        </scroll-view>
      </view>
      <view class="sperate"></view>
      <view class="department">
        <view class="label">职务</view>
        <scroll-view scroll-x="true" style="white-space: nowrap;" class="tagList">
          <view class="tag" v-for="item in userStore.positionInfo" :key="item.id">{{ item.name }}</view>
        </scroll-view>
      </view>
      <view class="sperate"></view>
      <view class="department">
        <view class="label">帮助中心</view>
        <view class="help">
          <image src="@/static/images/arrowRight@2x.png" mode="aspectFill"></image>
        </view>
      </view>
    </view>
    <view class="loginOut">
      <view class="loginOutButton" @click="loginOut">
        退出登录
      </view>
    </view>
  </view>

</template>
<style scoped lang="scss">
.body {
  background: #F6F7F9;
  width: 100vw;
  height: 100vh;
  .loginOut {
    margin-top: 340rpx;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .loginOutButton {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 240rpx;
    height: 80rpx;
    color: #221815;
    font-size: 28rpx;
    border-radius: 8rpx;
    border: 2rpx solid #221815;
  }

}
.content {
  
  padding: 200rpx 55rpx 40rpx;
  background-color: #fff;

  .infoHeader {
    display: flex;
    .avator {
      width: 95rpx;
      height: 95rpx;
      background-color: #000;
      border-radius: 50%;
      image {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 50%;
      }
    }
    .info {
      margin-left: 25rpx;
      .name {
        font-size: 40rpx;
        font-weight: 700;
        color: #221815;
      }
      .company {
        margin-top: 8rpx;
        font-size: 28rpx;
        font-weight: 300;
        color: #595757;
      }
    }
  }
  .sperate{
    width: 100%;
    margin-top: 40rpx;
    margin-bottom: 40rpx;
    height: 2rpx;
    background-color: #E9E9E9;
  }
  .phone {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .phoneNumber {
      font-size: 28rpx;
      font-weight: 500;
      color: #221815;
    }
  }
  .department {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 40rpx;
  }
  .label {
    font-weight: 300;
    font-size: 28rpx;
    color: #595757;
  }
  .tagList {
    width: 75%;
    display: flex;
    align-items: center;
    overflow-x: auto;
    justify-content: flex-end;
    // height: 100%;
    .tag {
      margin: 0 15rpx;
      color:#C7000B;
      border-radius: 20rpx;
      border: 2rpx solid #C7000B;
      font-size: 24rpx;
      padding: 0 16rpx;
      white-space: nowrap;
      display: inline-block;
    }
  }
  .help {
    image {
      width: 40rpx;
      height: 21rpx;
    }
  }
}
/* 隐藏滚动条 */
::-webkit-scrollbar {
  width: 0px;
  background-color: transparent;
}
</style>
