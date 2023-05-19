<script setup lang="ts">
import { PropType } from 'vue'
import { FormCompnentData } from '@/constants/form'

const props = defineProps({
  data: {
    type:  Object as PropType<FormCompnentData>,
    required: true
  },
  step: {
    type: Number,
    required: true
  }
});

</script>

<template>
<view class="title">
  <view class="left">{{ step }} {{ data.label }}</view>
  <view class="right">
    <uni-icons type="top" size="22"></uni-icons>
    <!-- <uni-icons type="bottom" size="22"></uni-icons> -->
  </view>
</view>
</template>

<style scoped lang="scss">
  .title {
    font-weight: 400;
    display: flex;
    justify-content: space-between;
    color: #221815;
    line-height: 40rpx;
    height: 40rpx;
    font-size: 28rpx;
    padding: 30rpx 0;
  }
</style>
