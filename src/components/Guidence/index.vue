<script setup lang="ts">
import {ref} from 'vue'

const props = defineProps({
  credit: {
    type: Boolean,
    required: true
  },
});
// 拉伸和收缩
const isShow = ref<boolean>(true)

// 预览
const preview = () => {
  uni.showLoading({ title: '加载中' })
  uni.downloadFile({
    url: "https://resource.zhuyiyun.com/687445113442304001/LENZvWYLy42DbOTfp3c6C.pdf",
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


// 展示更多
const showMore = () => {
  isShow.value  = !isShow.value
}
</script>

<template>
<view class="body">
  <view class="title"  @click="showMore">
    <view class="left">1.9 征信审核</view>
    <view class="right">
      <view class="credit" v-if="credit">已通过，请进入踏勘环节</view>
      <uni-icons type="top" size="22" v-if="isShow"></uni-icons>
      <uni-icons type="bottom" size="22" v-else></uni-icons>
    </view>
  </view>
  <view class="showInfo" :class="[isShow ? '' : 'hiddenInfo']" >
    <view class="content">
      点击查看征信审核查询指引，进行进度查看
    </view>
    <view class="imgPDF">
      <image @click="preview()" class="icon" mode="aspectFill" src="@/static/images/file_pdf.png"></image>
    </view>
    <view class="content">征信查询.pdf</view>
  </view>
</view>
</template>

<style scoped lang="scss">
.body {
  padding: 24rpx 32rpx;
}
.imgPDF {
  width: 132rpx;
  margin-top: 15rpx;
  height: 158rpx;
  .icon {
    width: 100%;
    height: 100%;
  }
}
.content {
  color: #595757;
  line-height: 40rpx;
  height: 40rpx;
  margin-top: 8rpx;
  font-size: 28rpx;
}
.title {
  font-weight: 400;
  display: flex;
  justify-content: space-between;
  color: #221815;
  line-height: 40rpx;
  min-height: 40rpx;
  font-size: 28rpx;
  font-weight: bold;
  .right {
    display: flex;
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
.credit {
  background: #C7000B;
  border-radius: 20rpx;
  color:#FFFFFF;
  font-size: 24rpx;
  padding: 0 18rpx;
  text-align: center;
  margin-right: 20rpx;
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
