<script setup lang="ts">
import { ref } from 'vue'
import {useClientStore} from '@/store'
import uniEasyinput from "@/uniComponents/uni-easyinput/uni-easyinput.vue"


const clientStore = useClientStore()

const date = ref()
const maskClick = (e) => {
  console.log(e)
}

</script>

<template>
<view class="IDcontent">
    
    <uni-forms ref="form" :modelValue="clientStore.IDCardForm" label-width="200rpx" :border="true">
			
		</uni-forms>
  </view>
</template>

<style scoped lang="scss">
.IDcontent {
  padding: 25rpx 32rpx 0;
  .title {
    font-weight: 400;
    display: flex;
    justify-content: space-between;
    color: #221815;
    line-height: 40rpx;
    height: 40rpx;
    font-size: 28rpx;
  }
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

}
.picker {
  height: 100%;
  display: flex;
  align-items: center;
  font-size: 28rpx;
  color: #A9A9A9;
  width: 100%;
  .date {
    width: 485rpx;
    height: 100%;
    display: flex;
  }
  .pickerIcons{
    display: flex;
    flex: 1;
    justify-content: flex-end;
    font-size: 22rpx;
  }
}
</style>
