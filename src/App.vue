<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";

onLaunch(() => {
});
onShow(() => {
});
onHide(() => {
  
});
</script>
<style lang="scss">
@import "@/static/iconfont.css";
body {
  background-color: #f0f0f0 !important;
}

#app {
  max-width: 800px;
  margin: 0 auto;
  height: auto;
  // padding-bottom: 50px;
  word-break: break-all;
}
uni-page {
  background: #fff;
  min-height: 100vh;
}
.uni-page-head {
  max-width: 800px;
  margin: 0 auto;
}

.primary-button {
  color: #fff;
  background-color: #007aff;
  line-height: 40px;
}
.primary-hover {
  color: rgba(255, 255, 255, 0.6);
  background-color: #0062cc;
}
.flex {
  display: flex;
}
.flex-jc {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.flex-jsb {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.flex-ac-c {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.flex-ac {
  display: flex;
  align-items: center;
}
.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}
.uni-form-item {
  margin: 30rpx 10px 0;

  .uni-title {
    margin-bottom: 10rpx;
    color: #606266;
    font-size: 30rpx;
    display: flex;
    align-items: center;
    .required {
      color: #dd524d;
      font-weight: bold;
    }
    .uni-tooltip-popup {
      width: max-content;
    }
  }
}
.uni-select {
  .uni-select__selector {
    z-index: 999 !important;
  }
}

.mr20 {
  margin-right: 20rpx;
}

.mr10 {
  margin-right: 10rpx;
}

.mr5 {
  margin-right: 5rpx;
}

.ml5 {
  margin-left: 5px;
}

.mb10 {
  margin-bottom: 10rpx;
}
.mt10 {
  margin-top: 10rpx;
}
.mt20 {
  margin-top: 20rpx;
}
.mb20 {
  margin-bottom: 20rpx;
}

.custom-input {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  width: auto;
  font-size: 14px;
  color: #6a6a6a;
  min-height: 35px;
  line-height: 35px;
  padding-right: 10px;
  padding-left: 10px;
  &:hover {
    border-color: #2977ff;
  }
}
.custom-input.disable {
  background-color: #f7f6f6;
  border-color: #dcdfe6;
}
.text-ov {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
</style>
