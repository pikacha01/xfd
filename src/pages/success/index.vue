<template>
  <view class="flex-jc wrap">
    <uni-icons type="checkbox-filled" color="#18bc37" size="80"></uni-icons>
    <h2>{{ props.formTitle }}</h2>
    <h4 class="mt10 mb80">提交成功</h4>
    <button
      class="primary-button width100"
      size="default"
      hover-class="primary-hover"
      @click="fillIn"
    >
      再填写一份
    </button>
  </view>
</template>

<script setup lang="ts">
import { onLoad } from "@dcloudio/uni-app";

const props = defineProps({
  formTitle: {
    type: String,
    required: true,
  },
});
function fillIn() {
  //@ts-ignore
  uni.navigateBack();
}
onLoad(() => {
  //@ts-ignore
  uni.setNavigationBarTitle({ title: "提交成功" });
});
</script>

<style>
.wrap {
  text-align: center;
  padding: 80px 20px;
}
.width100 {
  width: 100%;
}
.mb80 {
  margin-bottom: 80rpx;
}
</style>
