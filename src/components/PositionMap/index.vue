<script setup lang="ts">
import {} from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  }
});
const emits = defineEmits(["delete"])
</script>

<template>
  <view class="card">
    <view class="title">
      {{ title }}
      <view @click="emits('delete')" class="delPosition">
        <image src="@/static/images/delete@2x.png"></image>
      </view>
    </view>
    <view class="address">{{ address }}</view>
    <view class="location">经度{{ location.split(",")[0] }} 纬度 {{ location.split(",")[1] }}</view>
    <view>
      <image class="image" :src="image" ></image>
    </view>
  </view>
</template>

<style scoped lang="scss">
.card {
  margin-top: 5px;
  padding: 20rpx;
  box-shadow:0 2px 12px 0 rgba(0,0,0,0.1);
  .title {
    color: #333;
    font-size: 25rpx;
    font-weight: 700;
    margin-bottom: 2px;
    position: relative;
    .delPosition {
      position: absolute;
      top: 0;
      right: 0;
      image {
        width: 36rpx;
        height: 36rpx;
      }
    }
  }
  .address {
    font-size: 23rpx;
    margin-bottom: 5px;

  }
  .location {
    font-size: 21rpx;
    color:#9e9e9e;
  }
  .image{
    margin-top: 10rpx;
    height: 80px;
    width: 100%;

  }
}
</style>
