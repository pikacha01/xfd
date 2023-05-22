<script setup lang="ts">
import {computed} from 'vue'
import { onLoad } from "@dcloudio/uni-app"
import { useClientStore } from "@/store"

const steps = ["预审","踏勘","安装","并网"]

const props = defineProps<{
  currentStep: number,
  selectStep: number,
}>()

const emits = defineEmits(["changeStep"])

const changeStep = (index:number) => {
  emits('changeStep',index)
}


</script>

<template>
<!-- 基本用法 -->
  <view class="steps">
    <view class="step" v-for="(item,index) in steps" :key="item" @click="changeStep(index)">
        <view class="label">
          <view class="step-number" :class="{BGCRED : index <= props.currentStep}">{{ index + 1 }}</view>
          <view class="step-title" :class="{colorRed : index <= props.currentStep}">{{ item }}</view>
          <view class="underLine" v-if="index === Math.floor(selectStep)"></view>
        </view>
        <view class="step-line" :class="{BGCRED : index < props.currentStep}" v-if="index !== steps.length-1"></view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.steps {
  padding: 24rpx 32rpx;
  width: 100%;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  justify-content: space-between;
  .step {
    display: flex;
    align-items: center;
    .label{
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      .step-number{
        width: 40rpx;
        height: 40rpx;
        border-radius: 50%;
        background: #DCDCDC;
        text-align: center;
        line-height: 40rpx;
        color: #fff;
      }
      .step-title{
        margin-top: 5rpx;
        font-size: 28rpx;
        color: #595757;
      }
      .underLine {
        margin-top: 10rpx;
        width: 24rpx;
        height: 4rpx;
        background: #C7000B;
      }
    }
    .step-line{
      margin: 5rpx 0;
      width: 145rpx;
      height: 2rpx;
      background: #DCDCDC;
    }
  }
}
.colorRed {
  color: #C7000B !important;
}
.BGCRED {
  background-color: #C7000B !important;
}
</style>
