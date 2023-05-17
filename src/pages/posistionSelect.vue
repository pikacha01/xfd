<script setup lang="ts">
import { onMounted,ref,watch,nextTick } from 'vue'
import QQMapWX from '../utils/qqmap-wx-jssdk'
import { onShow, onLoad } from "@dcloudio/uni-app";

onShow(() => {
  console.log("onShow")
})
onLoad(()=>{
  console.log("onLoad")
})

interface searchList {
  address: string,
  location: {
    lat: number,
    lng: number
  },
  title: string,
  id: string
}

onMounted(() => {
  nextTick(() => {
    getAddress()
  })
})

const tMap = new QQMapWX({
  key: '5E3BZ-FSOWZ-FJUXK-7DZGV-RSEPH-GWBTL' //开发者密钥
});

// 搜索列表
const searchList = ref<searchList[]>([])

// 获取地理位置
const getAddress = () => {
  uni.getLocation({
    type: 'wgs84',
    geocode: true,
    success: (res) => {
      latitude.value = res.latitude
      longitude.value = res.longitude
    },
  })
}

// 定义经纬度数据
const latitude = ref()
const longitude = ref()
// 覆盖物
const covers = ref([{
  latitude: latitude.value,
  longitude: longitude.value,
  iconPath: '../static/images/positioning@2x.png',
  width: 28,
  height: 28,
  isCenter: true
}])

// 搜索地址
const searchAddress = ref<string>()
let searchTimer: number | null = null;
// 地址搜索
watch(() => {
  return searchAddress.value
}, () => {
  if (searchTimer) {
    clearTimeout(searchTimer);
  }
  if(searchAddress.value?.length === 0) return
  searchTimer = setTimeout(() => {
      tMap.search({
      keyword: searchAddress.value,
      success: (res) => {
        searchList.value = []
        res.data.forEach(item => {
          searchList.value.push({
            location: item.location,
            address: item.address,
            title: item.title,
            id: item.id
          })
        });
      }
    })
  }, 600);
})

watch(() => {
  return latitude.value
}, () => {
  covers.value[0].latitude = latitude.value
  covers.value[0].longitude = longitude.value
})

// 地图拖动点位始终在正中心
const onRegionChange = (e) => {
  if (e.type !== "end") return 
  covers.value[0].latitude = e.detail.centerLocation.latitude
  covers.value[0].longitude = e.detail.centerLocation.longitude
}

// 获取街道信息
watch(() => {
  return covers.value[0].longitude
}, () => {
  tMap.reverseGeocoder({
      location: {
        latitude: covers.value[0].latitude,
        longitude: covers.value[0].longitude
      }, //获取表单传入的位置坐标  固定坐标
      success: (res) => {
        searchAddress.value = res.result.address
      },
    })
})

// 改变选中位置
const changePosition = (item: searchList) => {
  covers.value[0].latitude= item.location.lat
  covers.value[0].longitude = item.location.lng
  searchAddress.value = item.title
  latitude.value = item.location.lat
  longitude.value = item.location.lng
  console.log(searchAddress.value)
  console.log(item.title)
}




</script>

<template>
  <view class="mapContainer">
    <map @regionchange="onRegionChange" style="width: 100%; height: 100%;" :latitude="latitude" :longitude="longitude" :markers="covers">
    </map>
  </view>
  <view class="addressSearch">
    <uni-easyinput prefixIcon="search" v-model.lazy="searchAddress" placeholder="请输入地址">
		</uni-easyinput>
    <view class="searchList">
      <view @click="changePosition(item)" class="searchItem" v-for="item in searchList" :key="item.id">
        <view class="title">{{ item.title }}</view>
        <view class="address">{{ item.address }}</view>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
  .mapContainer {
    width: 100%;
    height: 65vh;
  }
  .searchList {
    height: 35vh;
    overflow: auto; /* 开启滚动 */
  }
  .searchItem{
    margin-bottom: 15rpx;
    margin-left: 10rpx;
    width: 100%;
    .title {
      font-size: 25rpx;
      color: #333;
      font-weight: 700;
    }
    .address{
      color: #9e9e9e;
      font-size: 20rpx;
    }
  }
.searchList::-webkit-scrollbar {
  width: 0 !important; /* 隐藏滚动条 */
  height: 0 !important;
}
</style>
