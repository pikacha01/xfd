
<script setup lang="ts">
import { watch, ref } from 'vue'
import { onShow,onReachBottom } from "@dcloudio/uni-app"
import { useCountStore,useClientStore,useFormStore,useUserStore } from '@/store'

const userStore = useUserStore()
const store = useCountStore()
const formStore = useFormStore()
const clientStore = useClientStore()

// 控制重复是否重复刷新
let refresh = true
onShow(async () => {
  if (!store.token) {
    uni.navigateTo({
      url:"/pages/login"
    })
  }
  clientStore.getTabTotal()
  userStore.getCompany()
  userStore.getUserInfo()
  await clientStore.getClientInfo()
  selectTab.value = "全部"
  refresh = false
})

// 选中项
const selectTab = ref<string>("")

// 下拉框选项改变
const selectOptionChange = async (e: string) => {
  if (e === clientStore.selectOption) {
    return
  }
  refresh = true
  clientStore.statusFilter = []
  if (e === "") {
    selectOptions.value = [{ text: "全部", value: "" }]
    if (selectTab.value === "全部") {
    selectOptions.value = formStore.selectOption
    selectOptions.value.unshift({ text: "全部", value: "" })
    } else if (selectTab.value === "预审") {
      formStore.selectOption.forEach(item => {
        if (item.text === "草稿") {
          selectOptions.value.push(item)
        }
      })
    } else if (selectTab.value === "踏勘") {
      formStore.selectOption.forEach(item => {
        if (item.text === "踏勘" || item.text === "签约" || item.text === "银行初审") {
          selectOptions.value.push(item)
        }
      })
    } else if (selectTab.value === "安装") {
      formStore.selectOption.forEach(item => {
        if (item.text === "安装" || item.text === "自检") {
          selectOptions.value.push(item)
        }
      })
    } else if (selectTab.value === "并网") {
      formStore.selectOption.forEach(item => {
        if (item.text === "并网" || item.text === "验收" || item.text === "银行终审" || item.text === "放款成功") {
          selectOptions.value.push(item)
        }
      })
    }
    selectOptions.value.forEach(item => {
      if (item.value !== "") {
        clientStore.statusFilter.push(item.value)
      }
    })
  } else {
    clientStore.statusFilter.push(e)
  }
  clientStore.startZero()
  clientStore.selectOption = e
  clientStore.userList = []
  await clientStore.getClientInfo()
  refresh = false
}




// 下拉刷新
onReachBottom(async () => {
  if (refresh) {
    return 
  }
  if (clientStore.end >= clientStore.total!) {
    uni.showToast({
      title: "暂无数据了",
      icon: "error"
    })
    setTimeout(() => {
      uni.hideToast();
    }, 2000)
    return 
  }
  refresh = true
  await clientStore.getClientInfo()
  refresh = false
})
let searchTimer: number | null = null;
// 搜索姓名
const searchName = (e) => {
  if (searchTimer) {
    clearTimeout(searchTimer);
  }
  searchTimer = setTimeout(() => {
    clientStore.startZero()
    clientStore.userList = []
    clientStore.search = e
    clientStore.getClientInfo()
  }, 600);
}


// 切换Tab栏
const changeTab = (name: string) => {
  if(name === selectTab.value) return
  selectTab.value = name
  clientStore.userList = []
}

const selectOptions = ref<{ text: string, value: string }[]>([{ text: "全部", value: "" },...formStore.selectOption])
// Tab选项
watch(() => {
  return selectTab.value
}, async (newValue,oldValue) => {
  if(oldValue === "") return
  clientStore.startZero()
  selectOptions.value = [{ text: "全部", value: "" }]
  if (selectTab.value === "全部") {
    selectOptions.value = formStore.selectOption
    selectOptions.value.unshift({ text: "全部", value: "" })
  } else if (selectTab.value === "预审") {
    formStore.selectOption.forEach(item => {
      if (item.text === "草稿") {
        selectOptions.value.push(item)
      }
    })
  } else if (selectTab.value === "踏勘") {
    formStore.selectOption.forEach(item => {
      if (item.text === "踏勘" || item.text === "签约" || item.text === "银行初审") {
        selectOptions.value.push(item)
      }
    })
  } else if (selectTab.value === "安装") {
    formStore.selectOption.forEach(item => {
      if (item.text === "安装" || item.text === "自检") {
        selectOptions.value.push(item)
      }
    })
  } else if (selectTab.value === "并网") {
    formStore.selectOption.forEach(item => {
      if (item.text === "并网" || item.text === "验收" || item.text === "银行终审" || item.text === "放款成功") {
        selectOptions.value.push(item)
      }
    })
  }
  clientStore.statusFilter = []
  selectOptions.value.forEach(item => {
    if (item.value !== "") {
      clientStore.statusFilter.push(item.value)
    }
  })
  clientStore.selectOption = ""
  await clientStore.getClientInfo()
})
</script>

<template>
  <view>
    <view class="header">
      <view class="title">兴伏贷</view>
      <view class="userinfo">
        <view class="name">{{ userStore.userInfo?.name }}</view>
        <view class="company">{{ userStore.companyInfo?.name }}</view>
      </view>
      <view class="warning">
        <image  class="warningPng" src="@/static/images/notice@2x.png"></image>
        <view class="notice">5</view>
      </view>
    </view>
    <view class="Tabs">
      <view class="tab" v-for="item in clientStore.TabList" :key="item.text" @click="changeTab(item.text)">
        <view class="num" :class="{select:selectTab === item.text }">{{ item.value }}</view>
        <view class="text" :class="{select:selectTab === item.text }">{{ item.text }}</view>
      </view>
    </view>
    <view class="filter">
      <view class="search">
        <uni-search @input="searchName" radius="100" bgColor="#fff" placeholder="搜索" cancelButton="none"></uni-search>
      </view>
      <view class="selectOption">
        <uni-data-select :localdata="selectOptions" v-model="clientStore.selectOption" @change="selectOptionChange" :clear="false"></uni-data-select>
      </view>
    </view>
    <view class="content">
      <view class="userInfo" v-for="item in clientStore.userList" :key="item.id">
        <view class="left">
          <view class="name">{{ item.TextField_1 }}<text class="companyName">兴伏贷</text></view>
          <view class="holder">{{ item.owner }}</view>
        </view> 
        <view class="right">
          <view class="status" :class="{isDraft: item.GroupField_69 === '0' }">
            {{ clientStore.steps[item.label] }}
            {{ item.label }}
          </view>
          <view class="time">{{ item.DateField_4 }}</view>
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.header {
  display: flex;
  background: url("@/static/images/topBj@2x.png") no-repeat center center;
  background-size: 100% 100%;
  width: 100%;
  height: 400rpx;
  justify-content: space-between;
  position: relative;
  .title {
    position: absolute;
    color: #fff;
    font-size: 35rpx;
    top: 28%;
    left: 45%;
    font-weight: bold;
  }
  .userinfo {
    margin-top: 250rpx;
    margin-left: 30rpx;
    color: #fff;
    .name {
      font-size: 40rpx;
    }
    .company {
      margin-top: 10rpx;
      font-size: 25rpx;
    }
  }
  .warning {
    width: 32rpx;
    height: 100%;
    display: flex;
    align-items: center;
    margin-right: 40rpx;
    position: relative;
    margin-top: 50rpx;
    .warningPng {
      width: 32rpx;
      height: 32rpx;
    }
    .notice {
      width: 25rpx;
      height: 25rpx;
      line-height: 25rpx;
      text-align: center;
      position: absolute;
      font-size: 20rpx;
      top: 43%;
      right: -45%;
      background-color: #fff;
      border-radius: 50%;
      color: #C7000B;
    }
  }
}
.Tabs {
  padding: 24rpx 16rpx 0;
  width: 100%;
  height: 120rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  background: #F6F7F9;
  .tab {
    color: #221815;
    font-size: 28rpx;
    width: 18%;
    font-weight: 600;
    text-align: center;
    .select{
      color: #C7000B;
    }
  }
}
.filter { 
  background: #F6F7F9;
  display: flex;
  justify-content: space-between;
  height: 50px;
  padding: 0 16rpx;
  .search {
    width: 414rpx;
  }
  .selectOption{
    flex: 1;
    padding: 10px;
  }
}
.content {
  padding: 0 32rpx;
  background: #F6F7F9;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 60vh;
  margin-bottom: calc(env(safe-area-inset-bottom) + 40px);
  .userInfo {
    margin-top: 16rpx;
    width: 100%;
    height: 138rpx;
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    .left {
      margin-left: 24rpx;
      margin-top: 24rpx;
      .name {
        font-size: 28rpx;
        color: #221815;
        font-weight: 600;
        .companyName{
          margin-left: 24rpx;
          font-size: 24rpx;
          color: #595757;
          font-size: 400;
        }
      }
      .holder{
        margin-top: 24rpx;
        color:#A9A9A9;
        font-size: 24rpx;
      }
    }
    .right {
      margin-right: 24rpx;
      margin-top: 24rpx;
      .status {
        font-size: 28rpx;
        color: #C7000B;
        font-weight: 400;
        display: flex;
        justify-content: flex-end;
      }
      .isDraft {
        color: #595757;
      }
      .time{
        font-size: 24rpx;
        color: #A9A9A9;
        margin-top: 16rpx;
        font-size: 24rpx;
      }
    }
  }
}
:deep(.uni-select) {
  border-radius: 100px;
  background-color: #fff;
}
</style>
