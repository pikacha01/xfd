<template>
  <view class="uni-form-item">
    <uni-forms-item
      :name="props.item.id"
      :rules="[
        {
          required: props.item.required,
          errorMessage: `${props.item.label}不能为空`,
        },
      ]"
    >
      <template #label>
        <custom-label :item="props.item"></custom-label>
      </template>
      <view
        :class="[
          'custom-input',
          'lineHeight',
          props.item.readonly ? 'disable' : '',
        ]"
        @click="getLocation"
        id="showAddress"
      >
        <view>{{ model.pName }}</view>
        {{ model.address }}
        <view v-show="model.address">
          {{
            props.item.showSite
              ? `
        经度：${show.longitude} 纬度：${show.latitude}        `
              : ""
          }}
        </view>
        <img :src="model.staticPic" alt="图片" v-if="model.staticPic" />
      </view>
      <!-- 选择位置 -->
      <uni-popup ref="popupShow">
        <view class="wrap">
          <view id="container"></view>
          <view class="position flex-center" @click="position">
            <uni-icons
              type="location-filled"
              color="#fff"
              size="27"
            ></uni-icons>
          </view>
          <view class="content">
            <uni-easyinput
              prefixIcon="search"
              placeholder="搜索地点"
              @input="search"
              class="search"
            >
            </uni-easyinput>
            <view class="addressList mt10">
              <view
                v-for="item in model.resultAddress"
                :key="item.name"
                class="address flex-jsb"
                @click="chooseAddress(item)"
              >
                <view>
                  <h3>{{ item.name }}</h3>
                  <view class="des mt5">{{ item.address }}</view>
                </view>
                <uni-icons
                  type="location"
                  size="27"
                  color="#757575"
                ></uni-icons>
              </view>
            </view>
          </view>
        </view>
      </uni-popup>
    </uni-forms-item>
  </view>
</template>

<script lang="ts" setup>
import { getStaticPic } from "@/api/modules/user";
import { nextTick, reactive, ref, watch } from "vue";
import user from "@/api/modules/user";
import { useCountStore } from "@/store";
import { storeToRefs } from "pinia";
import { NUM } from "@/constants/form";

interface Model {
  address: string;
  location: string;
  pName: string;
  staticPic: string;
  type: number;
  map: any;
  resultAddress: Array<any>;
  markerList: Array<any>;
  currentLocation: CurrentLocation | null;
}
type CurrentLocation = {
  lng: number;
  lat: number;
};

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  value: {
    type: Object,
    required: true,
  },
});
// 获取自定义的store
const store = useCountStore();

// 取需要的 state
const { companyId, formId } = storeToRefs(store);

const model: Model = reactive({
  address: "",
  location: "",
  pName: "",
  staticPic: "",
  type: 0,
  map: {},
  resultAddress: [],
  markerList: [],
  currentLocation: null,
});

const show = reactive({
  latitude: 0,
  longitude: 0,
});

const popupShow = ref(null);

/**
 * 选择位置弹窗
 */
function popup() {
  model.resultAddress = [];
  const plugin: Record<string, any> = {
    zoom: 17,
  };

  if (model.location) {
    plugin.center = [
      model.location.split(",")[0],
      model.location.split(",")[1],
    ];
  }

  nextTick(() => {
    model.map = new AMap.Map("container", plugin);

    // 获取当前位置
    position();

    // 拖动结束事件
    model.map?.on("moveend", moverEnd);

    // 点击事件
    model.map?.on("click", mapClick);
  });
}

// 移动事件
const moverEnd = () => {
  centerMarker();
};

function centerMarker() {
  const { lng, lat } = model.map.getCenter();
  const aroundMess = {
    location: `${lng},${lat}`,
    moveLocation: `${lng},${lat}`,
    page_num: 1,
    companyId: companyId.value,
    formId: formId.value,
    page_size: 20,
    widgetId: props.item.id,
  };
  getPlaceByPlace(aroundMess);
  setMarker(lng, lat);
}

// 点击事件
const mapClick = (e: Record<string, any>) => {
  const {
    lnglat: { lng, lat },
  } = e;
  // 距离超了
  if (!rightDistances([lng, lat])) {
    uni.showToast({ title: "超过距离", icon: "error" });
    return;
  }
  // 经纬度逆遍码位置信息
  AMap.plugin("AMap.Geocoder", () => {
    const geocoder = new AMap.Geocoder({});
    geocoder.getAddress(
      [lng, lat],
      (status: string, result: Record<string, any>) => {
        if (status === "complete" && result.info === "OK") {
          const {
            regeocode: { formattedAddress },
          } = result;

          // const mess = {
          //   pName: formattedAddress,
          //   address: formattedAddress,
          //   location: `${lng},${lat}`,
          //   type: 0,
          // };
          changeModel(formattedAddress, lng, lat, formattedAddress);
          closePopup();
          //
          // this.emit("choose-value", mess);
        }
      }
    );
  });
};

/**
 * 获取周边信息
 * @param aroundMess
 */
function getPlaceByPlace(aroundMess) {
  // 距离超了
  if (
    !rightDistances([
      aroundMess.moveLocation.split(",")[0],
      aroundMess.moveLocation.split(",")[1],
    ])
  ) {
    uni.showToast({ title: "超过距离", icon: "error" });
    return;
  }
  user.getPlace(aroundMess).then(res => {
    if (res && res.length) {
      const list = res.map(({ name, address, location }) => ({
        name,
        address,
        location: {
          lng: location.split(",")[0],
          lat: location.split(",")[1],
        },
      }));
      model.resultAddress = [...list];
    }
  });
}
/**
 * 修改model
 * @param address
 * @param lng
 * @param lat
 * @param name
 */
async function changeModel(
  address: string,
  lng: number,
  lat: number,
  name: string
) {
  model.address = address;
  model.location = `${lng},${lat}`;
  model.pName = name;
  show.latitude = lat;
  show.longitude = lng;
  if (props.item.showMap) {
    model.staticPic = await getMapImg();
  }
  props.value[props.item.id] = {
    address,
    location: model.location,
    pName: name,
    staticPic: model.staticPic,
  };
}
/**
 * 添加标记
 * @param lng
 * @param lat
 * @param clear
 */
function setMarker(lng, lat, clear = true) {
  // 移除已创建的 marker
  if (clear) {
    model.markerList.map(item => {
      model.map.remove(item);
    });
  }
  // 创建一个 Marker 实例：
  var marker = new AMap.Marker({
    position: new AMap.LngLat(lng, lat), // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
  });

  // 将创建的点标记添加到已有的地图实例：
  model.map.add(marker);
  model.markerList.push(marker);
}

function rightDistances(checkPosition: Array<number>): boolean {
  if (props.item.range === NUM.ODD) {
    if (!model.currentLocation) {
      return false;
    }
    const dis = AMap.GeometryUtil.distance(checkPosition, [
      model.currentLocation?.lng,
      model.currentLocation?.lat,
    ]);
    return dis <= props.item.radius;
  }
  return true;
}

/**
 * 获取当前定位
 */
function position() {
  AMap.plugin("AMap.Geolocation", function () {
    var geolocation = new AMap.Geolocation({
      enableHighAccuracy: true, //是否使用高精度定位，默认:true
      timeout: 10000, //超过10秒后停止定位，默认：5s
      zoomToAccuracy: true, //定位成功后是否自动调整地图视野到定位点
    });

    geolocation.getCurrentPosition(function (status, result) {
      if (status == "complete") {
        const {
          position: { lat, lng },
          formattedAddress,
        } = result;

        // const {
        //     position: { lat, lng },
        //     formattedAddress
        //   } = result;
        //   this.model.selectLocation = {
        //     address: formattedAddress,
        //     location: `${lng},${lat}`,
        //     pName: "(我的位置)",
        //     type: 0
        //   };

        model.currentLocation = { lat, lng };
        setMapCenter(lng, lat);
        changeModel(formattedAddress, lng, lat, formattedAddress);

        setMarker(lng, lat);
        // this.model.originAddress = formattedAddress;
      } else {
        centerMarker();
        // if (show.longitude) {
        //   setMarker(show.longitude, show.latitude);
        // }
      }
    });
  });
}

/**
 * 搜索位置
 * @param keyword
 */
function search(keyword) {
  if (!keyword) {
    return;
  }
  AMap.plugin("AMap.Autocomplete", function () {
    var autoOptions = {
      //city 限定城市，默认全国
      city: "全国",
    };
    // 实例化AutoComplete
    var autoComplete = new AMap.Autocomplete(autoOptions);
    // 根据关键字进行搜索
    autoComplete.search(keyword, function (status, result) {
      // 搜索成功时，result即是对应的匹配数据
      if (result) {
        model.resultAddress = result.tips.filter(
          ({ location, address }) => location && typeof address == "string"
        );
      }
    });
  });
}
/**
 * 选择位置
 */
function chooseAddress(info: any) {
  const {
    address,
    location: { lng, lat },
    name,
  } = info;
  // 距离超了
  if (!rightDistances([lng, lat])) {
    uni.showToast({ title: "超过距离", icon: "error" });
    return;
  }
  changeModel(address, lng, lat, name);
  closePopup();
}

function getMapImg(): Promise<string> {
  return new Promise(resolve => {
    // 获取元素宽度
    let width = 320;
    const query = uni.createSelectorQuery();
    query.select("#showAddress").boundingClientRect(data => {
      if (data && data.width) {
        width = data.width - 20;
      }
    });

    query.exec();
    getStaticPic({
      location: model.location,
      zoom: "17",
      size: Math.floor(width) + "*110",
    }).then(res => {
      resolve(res.data);
    });
  });
}
/**
 * 关闭弹唱
 */
function closePopup() {
  // @ts-ignore
  popupShow.value.close();
}

watch(
  () => props.value[props.item.id],
  newV => {
    if (!newV) {
      model.pName = "";
      model.address = "";
      model.location = "";
      model.staticPic = "";
      show.latitude = 0;
      show.longitude = 0;
      model.currentLocation = null;
    }
  }
);

function setMapCenter(lng?: number, lat?: number) {
  if (lng && lat) {
    model.map.setCenter([lng, lat]); //设置地图中心点
  }
}

function getLocation() {
  if (props.item.readonly) {
    return;
  }
  // #ifndef H5
  chooseLocation();
  // #endif

  // #ifdef  H5
  //@ts-ignore
  popupShow.value.open("bottom");
  popup();
  // #endif
}
/**
 * 小程序选择位置
 */
function chooseLocation() {
  uni.chooseLocation({
    success: function (res) {
      changeModel(res.address, res.longitude, res.latitude, res.name);
      // model.address = res.address;
      // model.location = res.longitude + "," + res.latitude;
      // model.pName = res.name;
      // show.latitude = res.latitude;
      // show.longitude = res.longitude;
      console.log("位置", res);

      // props.value[props.item.id] = model;
    },
  });
}
</script>

<style>
.lineHeight {
  line-height: 26px;
}
.wrap {
  height: 70vh;
  width: 100%;
  background: #fff;
}
#container {
  width: 100%;
  height: 200px;
}
.content {
  padding: 10px 0;
}
.address {
  border-bottom: 1px #efefef solid;
  padding: 5px 20px;
}
.addressList {
  height: calc(70vh - 200px - 60px);
  overflow: auto;
}
.search {
  width: 90%;
  margin: 0 auto;
}
.des {
  color: #757575;
  font-size: 14px;
}
.position {
  position: absolute;
  right: 10px;
  top: 160px;
  z-index: 999;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.3);
}
</style>
