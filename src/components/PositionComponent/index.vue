<script setup lang="ts">
import { getStaticPic } from "@/api/modules/user";
import { PropType,ref,watch } from 'vue'
import { FormCompnentData } from '@/constants/form'
import { useFormStore } from "@/store";
import PositionMap from '@/components/PositionMap/index.vue'

// 获取自定义的store
const formStore = useFormStore()

// 取需要的 state
const props = defineProps({
  data: {
    type:  Object as PropType<FormCompnentData>,
    required: true
  },
});

// 获取图片
function getMapImg(location:string): Promise<string> {
  return new Promise(resolve => {
    // 获取元素宽度
    let width = 300;
    const query = uni.createSelectorQuery();
    query.select("#showMap").boundingClientRect(data => {
      if (data && data.width) {
        width = data.width - 20;
      }
    });
    query.select('#showMap').fields({
      size: true
    }, res => {
    }).exec(() => {
    })

    query.exec();
    getStaticPic({
      location: location,
      zoom: "17",
      size: Math.floor(width) + "*110",
    }).then(res => {
      resolve(res.data);
    });
  });
}

// 检测表单子传父事件
const emits = defineEmits(["checkForm"])

// 去地图重新定位
const goMap = () => {
  if(props.data.readonly || (Object.entries(formStore.currentFormSteps!.data.initData).length === 0)) return
  uni.chooseLocation({
    success: async (res) => {
      const tempPosition = {
        address: res.address,
        location: `${res.longitude},${res.latitude}`,
        pName: res.name,
        staticPic: "",
        type: 1
      }
      const statiPic = await getMapImg(tempPosition.location)
      tempPosition.staticPic = statiPic
      formStore.currentFormSteps!.data.initData.PositionField_67 = tempPosition
      formStore.changeForm["PositionField_67"] = tempPosition
      // 检测表单子传父事件
      emits("checkForm")
    }
  })
    
}

// 删除地理位置
const deletePosition = () => {
  if(props.data.readonly || (Object.entries(formStore.currentFormSteps!.data.initData).length === 0)) return
  formStore.currentFormSteps!.data.initData.PositionField_67 = null
  // 改变赋值
  formStore.changeForm["PositionField_67"] = null
  // 检测表单子传父事件
  emits("checkForm")
}

</script>

<template>
<view class="positionCard">
  <view class="showMap" @click="goMap" id="showMap">
    <view class="left">
      地址定位
    </view>
    <view class="right">
      <uni-icons class="pickerIcons" type="location-filled" color="#A9A9A9" size="22"></uni-icons>
    </view>
  </view>
  <template v-if="formStore.currentFormSteps?.data.initData[data.id]?.staticPic">
    <PositionMap 
      :title="formStore.currentFormSteps!.data.initData[data.id].pName"
      :address="formStore.currentFormSteps!.data.initData[data.id].address"
      :location="formStore.currentFormSteps!.data.initData[data.id].location"
      :image="formStore.currentFormSteps!.data.initData[data.id].staticPic"
      :readonly="data.readonly || (Object.entries(formStore.currentFormSteps!.data.initData).length === 0)"
      @delete="deletePosition"
      >
    </PositionMap>
  </template>
</view>
</template>

<style scoped lang="scss">
.positionCard {
  min-height: 36px;
  border-top: 2rpx solid #E9E9E9;
  padding: 10px 0;
  .showMap {
    display: flex;
    justify-content: space-between;
    width: 100%;
    line-height: 36px;
    .left {
      font-size: 28rpx;
      font-weight: 400;
      color: #595757;
    }
  }
}
.showMap {
  z-index: 20;
  position: relative;
  .mapClose {
    z-index: 200;
    position: absolute;
    top: 0;
    right: 0;
  }
}
.positionCard {
  .showMap {
    display: flex;
    justify-content: space-between;
    .left {
      font-size: 28rpx;
      font-weight: 400;
      color: #595757;
    }
  }
}
</style>
