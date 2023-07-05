<script setup lang="ts">
import { watch, ref,onMounted,nextTick } from 'vue'
import { onReachBottom,onShow } from "@dcloudio/uni-app"
import { useCountStore,useClientStore,useFormStore,useUserStore } from '@/store'
import { clienData } from '@/constants/client'
import { connectmqtt } from '@/utils/webSocket'
import {onShareAppMessage } from '@dcloudio/uni-app'

onShareAppMessage(() => {
  return {
      title: '华福宝小程序',
      path: '/pages/login',
    }
})

onShow(async () => {
  if (refresh) {
    return 
  }
  refresh = true
  clientStore.userList = []
  clientStore.startZero()
  await clientStore.getClientInfo()
  refresh = false
});
// onHide(() => {
//   closeSocket()
// });

let refresh = true

const userStore = useUserStore()
const store = useCountStore()
const formStore = useFormStore()
const clientStore = useClientStore()

// 需要监听定位的dom
// const instance = getCurrentInstance()
// let header : any = null
// let title: any = null

// 控制重复是否重复刷新
onMounted(async() => {
  if (!store.token) {
    uni.redirectTo({
      url:"/pages/login"
    })
  } else {
    await connectmqtt()
  }
  await formStore.getClientFormInfo()
  await clientStore.getTabTotal()
  await userStore.getCompany()
  selectTab.value = "全部"
  refresh = false
  // const query = uni.createSelectorQuery().in(instance);
  // header = query.select("#header")
  // title = query.select("#title")
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
const triggered = ref(false)

const onPullDownRefresh = async () => {
  if (refresh) {
    uni.showToast({
      title: "正在加载中",
      icon: "error",
      duration: 2000
    })
    return 
  }
  refresh = true
  uni.showLoading({ title: '加载中' })
  await formStore.getClientFormInfo()
  refresh = false
  uni.hideLoading()
  triggered.value = false
  uni.showToast({
    title: "数据加载成功",
    icon: "success",
    duration: 2000
  })
}

// 触底加载
// onReachBottom(async () => {
//   if (refresh) {
//     return 
//   }
//   if (clientStore.end >= clientStore.total!) {
//     uni.showToast({
//       title: "暂无数据了",
//       icon: "error"
//     })
//     setTimeout(() => {
//       uni.hideToast();
//     }, 2000)
//     return 
//   }
//   refresh = true
//   await clientStore.getClientInfo()
//   refresh = false
// })

const handleScrollToLower = async () => {
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
}

let searchTimer: any = null;
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
}, async () => {
  clientStore.startZero()
  selectOptions.value = [{ text: "全部", value: "" }]
  if (selectTab.value === "全部") {
    formStore.selectOption.forEach(item => {
      selectOptions.value.push(item)
    })
    // selectOptions.value = [{ text: "全部", value: "" },...formStore.selectOption]
    // selectOptions.value.unshift({ text: "全部", value: "" })
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
  refresh = true
  clientStore.userList = []
  await clientStore.getClientInfo()
  refresh = false
})

// 详情页跳转
const goUserDetail = (item:clienData,userCurrentStep) => {
  formStore.goUserDetailInfo = item
  formStore.userCurrentStep = userCurrentStep
  formStore.userSelectStep = userCurrentStep
  uni.navigateTo({
    url:"/pages/formInfo"
  })
}

// 修改滚动的样式
const showName = ref(true)
const headerPosition = ref("relative")
const headerMargin = ref("0rpx")
const TabsPosition = ref("static")
const TabsMargin = ref("0rpx")
const filterPosition = ref("static")
const filterMargin = ref("0rpx")
const title = ref("45%")
const isWarning = ref(false)
// 监听页面滑动
const onScroll = (e) => {
  oldScrollTop.value = e.detail.scrollTop
  if (e.detail.scrollTop >= 80) {
    headerPosition.value = "fixed"
    headerMargin.value = "-200rpx"
    TabsPosition.value =  "fixed"
    filterPosition.value = "fixed"
    TabsMargin.value = "200rpx"
    filterMargin.value = "310rpx"
    title.value = "3%"
    showName.value = false
    isWarning.value = true
    isTopShow.value = true
  } else {
    headerPosition.value = "relative"
    headerMargin.value = "0rpx"
    TabsPosition.value =  "static"
    filterPosition.value = "static"
    TabsMargin.value = "0rpx"
    filterMargin.value = "0rpx"
    title.value = "45%"
    showName.value = true
    isWarning.value = false
    isTopShow.value = false
  }
}

// 滚动距离
const scrollTop = ref(0)
const oldScrollTop = ref(0)
let isComplete = false
// 回到顶部
const gotoTop = () => {
  if (!isTopShow) return
  if(isComplete) return
  isComplete = true
  scrollTop.value = oldScrollTop.value
  toView.value = 'userInfo0'
  isComplete = false
  nextTick(() => {
    // scrollTop.value = 0 
    toView.value = ''
  })
}

const toView = ref()

// 回到顶部按钮是否展示
const isTopShow = ref(false)
</script>
<template>
  <view class="bodyBGC">
    <scroll-view class="scroll-view" :scroll-into-view="toView" :scroll-with-animation="true" @refresherrefresh="onPullDownRefresh" :refresher-triggered="triggered" scroll-y @scroll="onScroll" style="overflow: scroll;" @scrolltolower="handleScrollToLower">
      <view class="header" id="header" :style="{'position': headerPosition,'margin-top': headerMargin}">
          <view class="title" id="title" :style="{'left': title}">兴福宝</view>  
        <view class="userinfo" v-if="showName">
          <view class="name">{{ userStore.userInfo?.name }}</view>
          <view class="company">{{ userStore.companyInfo?.name }}</view>
        </view>
        <view :class="{warningLeft: isWarning === true}" class="warningFixed">
          <view class="warning">
            <image  class="warningPng" src="@/static/images/notice@2x.png"></image>
            <view class="notice">5</view>
          </view>
        </view>
      </view>
      <view class="Tabs" :style="{'position': TabsPosition,'margin-top': TabsMargin}">
        <view class="tab" v-for="item in clientStore.TabList" :key="item.text" @click.stop="changeTab(item.text)">
          <view class="num" :class="{select:selectTab === item.text }">{{ item.value }}</view>
          <view class="text" :class="{select:selectTab === item.text }">{{ item.text }}</view>
        </view>
      </view>
      <view class="filter" :style="{'position': filterPosition,'margin-top': filterMargin}">
        <view class="search">
          <uni-search @input="searchName" radius="100" bgColor="#fff" placeholder="搜索" cancelButton="none"></uni-search>
        </view>
        <view class="selectOption">
          <uni-data-select :localdata="selectOptions" v-model="clientStore.selectOption" @change="selectOptionChange" :clear="false"></uni-data-select>
        </view>
      </view>
      <view class="content">
        <view class="userInfo" :id="'userInfo'+index" @click.stop="goUserDetail(item,clientStore.steps[item.label])" v-for="(item,index) in clientStore.userList" :key="item.id">
          <view class="left">
            <view class="name">{{ item.TextField_1 }}<text class="companyName">兴福宝</text></view>
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
    </scroll-view>
    <view class="toTop"  v-if="isTopShow" @click="gotoTop" @touchstart.prevet>
        <uni-icons type="top" size="30" ></uni-icons>
      </view>
  </view>
</template>

<style scoped lang="scss">

.bodyBGC {
  background-color: #F6F7F9;
}
.warningFixed{
  position: fixed;
  top: 13%;
  right: 5%;
}   
.toTop {
  position: fixed;
  right: 5%;
  bottom: 20%;
  width: 68rpx;
  height: 68rpx;
  background-color: #f6f7f9;
  display: flex;
  justify-content: center;
  align-items: center;
}
.scroll-view {
  height: calc(100vh - 150rpx);
  // margin-bottom: calc(env(safe-area-inset-bottom) + 40px);
}

.warningLeft {
 top: 7%;
 left: 20%;
}
.header {
  display: flex;
  background: url("@/static/images/topBj@2x.png") no-repeat center center;
  background-size: 100% 100%;
  width: 100%;
  height: 400rpx;
  justify-content: space-between;
  position: relative;
  .title {
    position: fixed;
    color: #fff;
    font-size: 35rpx;
    top: 6.5%;
    left: 45%;
    font-weight: bold;
    animation: slide-in 0.5s ease;
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
    display: flex;
    align-items: center;
    position: relative;
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
      top: -30%;;
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
  box-sizing: border-box;
  width: 100%;
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
