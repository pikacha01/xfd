<script setup lang="ts">
import { PropType,ref,watch } from 'vue'
import { FormCompnentData } from '@/constants/form'
import { useFormStore } from "@/store";
import { previewImg } from '@/utils/imgPreview'
import { OcrIdCard } from '@/utils/baiduAi'

// 获取自定义的store
const formStore = useFormStore()

// 取需要的 state
const props = defineProps({
  data: {
    type:  Object as PropType<FormCompnentData>,
    required: true
  },
});



// 各个对应的值
const IDCardFormInfo = {
  "失效日期": "DateField_17",
  "签发日期": "DateField_16",
  "住址": "TextField_21",
  "公民身份号码": "IdentityField_15",
  "出生": "DateField_12",
  "姓名": "TextField_1",
  "性别": "GroupField_13",
  "民族":"TextField_76"
}

// 身份证上传
const upLoadCard = async (direction: string) => {
  if(props.data.readonly) return 
  const res: any = await OcrIdCard(direction)
  res[0].words_result_num === 6 ? formStore.currentFormSteps!.data.initData.PicField_43.push(res[1]) : formStore.currentFormSteps!.data.initData.PicField_44.push(res[1])
  if (formStore.currentFormSteps!.data.initData.PicField_43.length !== 0 && formStore.currentFormSteps!.data.initData.PicField_44.length !== 0) {
    formStore.currentFormSteps!.data.initData.TextField_87 = formStore.currentFormSteps?.data.initData.TextField_87 as string
    if (formStore.currentFormSteps?.stepId === "_end_id") {
      uni.showToast({
        title: "用户已存在",
        icon: "error"
      })
    }
  }
  for (let index in res[0].words_result) {
    if (index.includes("日期") || index === "出生") {
      const tempData = res[0].words_result[index].words
      const formattedDateStr = `${tempData.slice(0, 4)}-${tempData.slice(4, 6)}-${tempData.slice(6)}`;
      formStore.currentFormSteps!.data.initData[IDCardFormInfo[index]] = formattedDateStr
    } else {
      formStore.currentFormSteps!.data.initData[IDCardFormInfo[index]] = res[0].words_result[index].words
    }
    if (index === "住址") {
      formStore.currentFormSteps!.data.initData[IDCardFormInfo[index]] = res[0].words_result[index].words
    }
    if (index === "性别") {
      formStore.currentFormSteps!.data.initData[IDCardFormInfo[index]] = res[0].words_result[index].words === "男" ? "1" : "2"
    }
  }
  
}
</script>

<template>
<view class="IDCard">
  <view class="left">
    证件信息
  </view>
  <view class="right">
    <view v-if="formStore.currentFormSteps!.data.initData.PicField_43.length === 0" class="person" @click="upLoadCard('front')">
      <view>
        <image src="@/static/images/upload@2x.png"></image>
      </view>
      <view>
        身份证人像面
      </view>
    </view>
    <view v-else class="person">
      <view class="IDImageBox">
        <image @click="previewImg(formStore.currentFormSteps!.data.initData.PicField_43[0].url,formStore.currentFormSteps!.data.initData.PicField_43)" class="IDImage" :src="formStore.currentFormSteps!.data.initData.PicField_43[0].url"></image>
        <uni-icons v-if="!data.readonly" class="delImage"  type="closeempty" color="#fff" size="22" @click.stop="formStore.currentFormSteps!.data.initData.PicField_43 = []"></uni-icons>
      </view>
    </view>
    <view  v-if="formStore.currentFormSteps!.data.initData.PicField_44.length === 0" class="nation"  @click="upLoadCard('back')">
      <view>
        <image src="@/static/images/upload@2x.png"></image>
      </view>
      <view>
        身份证国徽面
      </view>
    </view>
    <view v-else class="person" style="margin-left: 28rpx;">
      <view class="IDImageBox">
        <image @click="previewImg(formStore.currentFormSteps!.data.initData.PicField_44[0].url,formStore.currentFormSteps!.data.initData.PicField_44)"  class="IDImage" :src="formStore.currentFormSteps!.data.initData.PicField_44[0].url"></image>
        <uni-icons v-if="!data.readonly" class="delImage" type="closeempty" color="#fff" size="22" @click.stop="formStore.currentFormSteps!.data.initData.PicField_44 = []"></uni-icons>
      </view>
    </view>
  </view>
</view>
</template>

<style scoped lang="scss">
.IDCard {
    margin-top: 16rpx;
    display: flex;
    justify-content: space-between;
    .left {
      font-size: 28rpx;
      font-weight: 400;
      color: #595757;
    }
    .right {
      flex: 1;
      display: flex;
      justify-content: flex-end;
      font-size: 24rpx;
      .person {
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
        background: url("@/static/images/IDcard.png") no-repeat center center;
        background-size: 100% 100%;
        width: 232rpx;
        height: 152rpx;
        .IDImageBox {
          position: relative;
          .IDImage {
            width: 232rpx;
            height: 152rpx;
          }
          .delImage {
            position: absolute;
            right: 0;
            top: 0;
            z-index: 10;
          }
        }
        image {
          width: 36rpx;
          height: 36rpx;
        }
      }
      .nation {
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
        background: url("@/static/images/IDcard.png") no-repeat center center;
        background-size: 100% 100%;
        width: 232rpx;
        height: 152rpx;
        image {
          width: 36rpx;
          height: 36rpx;
        }
      }
    }
  }
</style>
