<script setup lang="ts">
import { ref,onMounted,nextTick,watch } from 'vue'
import {useClientStore,useFormStore} from '@/store'
import { OcrIdCard } from '@/utils/baiduAi'
import uniEasyinput from "@/uniComponents/uni-easyinput/uni-easyinput.vue"
import QQMapWX from '../../utils/qqmap-wx-jssdk'
import { getStaticPic } from "@/api/modules/user";
import PositionMap from '@/components/PositionMap/index.vue'
import { previewImg } from '@/utils/imgPreview'

const clientStore = useClientStore()
const formStore = useFormStore()

onMounted(() =>{
  nextTick(()=>{
    getMapAddress()
  })
})

// 获取当前地理位置
const latitude = ref()
const longitude = ref()

// 获取地理位置的方法
const getMapAddress = ()=> {
  const tMap = new QQMapWX({
    key: '5E3BZ-FSOWZ-FJUXK-7DZGV-RSEPH-GWBTL' //开发者密钥
  });
  //使用 uni.getLocation获取用户所在经纬度
  uni.getLocation({
    type: 'wgs84',
    geocode: true,
    success: (res) => {
      latitude.value = res.latitude
      longitude.value = res.longitude
    },
    fail: () => {
    },
    complete: () => {
      // 使用腾讯sdk的reverseGeocoder方法 解析经纬度
      tMap.reverseGeocoder({
        success: async function (res) {
          const tempPosition = {
            address: res.result.address,
            location: `${res.result.location.lng},${res.result.location.lat}`,
            pName: res.result.formatted_addresses.recommend,
            staticPic: "",
            type: 1
          }
          const statiPic = await getMapImg(tempPosition.location)
          tempPosition.staticPic = statiPic
          clientStore.IDCardForm.PositionField_67 = tempPosition
        },
        fail: function(res) {
          uni.showToast({
            title: '定位失败',
            duration: 2000,
            icon: "none"
          })
        }
      })
    }
  })
}
// 获取static方法
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

// 去地图重新定位
const goMap = () => {
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
      clientStore.IDCardForm.PositionField_67 = tempPosition
    }
  })
    
}

// 删除地理位置
const deletePosition = () => {
  clientStore.IDCardForm.PositionField_67 = null
}


// 各个对应的值
const IDCardFormInfo = {
  "失效日期": "DateField_17",
  "签发日期": "DateField_16",
  "住址": "TextField_21",
  "公民身份号码": "IdentityField_15",
  "出生": "DateField_12",
  "姓名": "TextField_1",
  "性别": "GroupField_13",
  "民族":"TextField_76",
}

// 身份证上传
const upLoadCard = async (direction:string) => {
  const res: any = await OcrIdCard(direction)
  res[0].words_result_num === 6 ? formStore.IDCardInfo.PicField_43.push(res[1]) : formStore.IDCardInfo.PicField_44.push(res[1])
  if (formStore.IDCardInfo.PicField_43.length !== 0 && formStore.IDCardInfo.PicField_44.length !== 0) {
    formStore.IDCardInfo.TextField_87 = formStore.newFormSteps?.data.initData.TextField_87 as string
    await formStore.stepUpload(formStore.IDCardInfo)
    // if (formStore.newFormSteps?.stepId === "_end_id") {
    //   uni.showToast({
    //     title: "用户已存在",
    //     icon: "error"
    //   })
    // }
  }
  for (let index in res[0].words_result) {
    if (index.includes("日期") || index === "出生") {
      const tempData = res[0].words_result[index].words
      const formattedDateStr = `${tempData.slice(0, 4)}-${tempData.slice(4, 6)}-${tempData.slice(6)}`;
      if (index === "失效日期") {
        res[0].words_result[index].words === "长期" ? idLength.value = ["1"] : clientStore.IDCardForm[IDCardFormInfo[index]] = formattedDateStr
      } else {
        clientStore.IDCardForm[IDCardFormInfo[index]] = formattedDateStr
      }
    } else {
      clientStore.IDCardForm[IDCardFormInfo[index]] = res[0].words_result[index].words
    }
    if (index === "住址") {
      clientStore.IDCardForm.TextField_84 = res[0].words_result[index].words
    }
    if (index === "性别") {
      sexSelect.value = res[0].words_result[index].words === "男" ? 0 : 1
      clientStore.IDCardForm[IDCardFormInfo[index]] = res[0].words_result[index].words === "男" ? "1" : "2"
    }
  }
  
}

// 性别
const sex = ["男", "女"]
//选择的性别
const sexSelect = ref<number>()
// 更改性别
const changeSex = (e) => {
  sexSelect.value = Number(e.detail.value)
  clientStore.IDCardForm.GroupField_13 = String(Number(e.detail.value) + 1) 
}

// 更改生日
const changeBirthday = (e) =>{
  clientStore.IDCardForm.DateField_12 = e.detail.value
}

// 改变身份起止时间
const changeIDCardStart = (e) => {
  clientStore.IDCardForm.DateField_16 = e.detail.value
}

// 改变身份起止时间
const changeIDCardEnd = (e) => {
  clientStore.IDCardForm.DateField_17 = e.detail.value
}

const reginSelect = ref<string[]>()
const changeRegin = (e) => {
  clientStore.IDCardForm.RegionField_20 = e.detail.code
  reginSelect.value = e.detail.value
}

const IDform = ref(null)
// 表单提交
const submitForm = async () => {
    //@ts-ignore
  IDform.value.validate().then(async res => {
    if (!formStore.IDCardInfo.PicField_43[0] || !formStore.IDCardInfo.PicField_44[0]) {
      uni.showToast({
        title: '请上传身份证',
        icon: "error",
        duration: 2000,
      })
      return
    }
    const data = await formStore.validateForm(clientStore.IDCardForm)
    //@ts-ignore
    if (data.success) {
      formStore.stepUpload(clientStore.IDCardForm)
      uni.showToast({
        title: '上传成功',
        duration: 2000,
      })
      uni.navigateTo({
        url:"/pages/index/index"
      })
      clientStore.IDCardForm= {
        DateField_4: null,
        JoinFormField_89: null,
        MemberField_3: null,
        MemberField_5: null,
        TextField_88: null,
        id: null,
        DateField_12: null,
        DateField_16: null,
        DateField_17: null,
        GroupField_13: null,
        IdentityField_15: null,
        MemberField_48: null,
        PhoneField_9: "",
        PositionField_67: null,
        RegionField_20: null,
        SelectField_58: null,
        TextField_1: null,
        TextField_76: null,
        TextField_21: null,
        TextField_84: null,
        TextField_87:null,
      }
    }
  }).catch(err => {
    console.log('err', err);
  })
}

//校验规则
const idFormRules = {
  // 手机号码 
  PhoneField_9: {
    rules: [{
      format: 'string',
      required: true,
      errorMessage: '请输入手机号码',
      validateTrigger: "blur"
    }, {
      validateFunction: function (rule, value, data, callback) {
        return new Promise((resolve, reject) => {
          if (!/^1[3456789]\d{9}$/.test(value)) {
            reject(new Error('手机号码输入错误'))
          }
          //@ts-ignore
          resolve()
        })
      }
    }]
  },
  // 身份证号码验证
  IdentityField_15: {
    rules: [{
      format: 'string',
      validateTrigger: "blur"
    }, {
      validateFunction: function(rule, value, data, callback) {
        return new Promise((resolve, reject) => {
          if (!/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value)) {
            reject(new Error('身份证号码输入错误'))
          }
          //@ts-ignore
          resolve()
        })
      }
    }]
  },
  // 地区选择
  RegionField_20: {
    rules: [{
      required: true,
      errorMessage: '地区不能为空'
    }]
  }

}

// 身份证长期有效
const IDlength = [{
  text: "长期有效",
  value: "1"
}]

const idLength = ref<string []>([])

watch(() => {
  return idLength[0]
}, () => {
  idLength.value[0] === "1" ? clientStore.IDCardForm.SelectField_58 = ["1"] : clientStore.IDCardForm.SelectField_58 = null
})

</script>

<template>
  <view class="IDcontent">
    <view class="title">
      <view class="left">1.1 用户基本信息</view>
      <view class="right">
        <uni-icons type="top" size="22"></uni-icons>
        <!-- <uni-icons type="bottom" size="22"></uni-icons> -->
      </view>
    </view>
    <uni-forms :border="true" ref="IDform" :rules="idFormRules"  :modelValue="clientStore.IDCardForm" label-width="200rpx">
      <view class="IDCard">
        <view class="left">
          证件信息
        </view>
        <view class="right">
          <view v-if="formStore.IDCardInfo.PicField_43.length === 0" class="person" @click="upLoadCard('front')">
            <view>
              <image src="@/static/images/upload@2x.png"></image>
            </view>
            <view>
              身份证人像面
            </view>
          </view>
          <view v-else class="person">
            <view class="IDImageBox">
              <image @click="previewImg(formStore.IDCardInfo.PicField_43[0].url,formStore.IDCardInfo.PicField_43)" class="IDImage" :src="formStore.IDCardInfo.PicField_43[0].url"></image>
              <uni-icons class="delImage"  type="closeempty" color="#fff" size="22" @click.stop="formStore.IDCardInfo.PicField_43 = []"></uni-icons>
            </view>
          </view>
          <view  v-if="formStore.IDCardInfo.PicField_44.length === 0" class="nation"  @click="upLoadCard('back')">
            <view>
              <image src="@/static/images/upload@2x.png"></image>
            </view>
            <view>
              身份证国徽面
            </view>
          </view>
          <view v-else class="person" style="margin-left: 28rpx;">
            <view class="IDImageBox">
              <image class="IDImage" @click="previewImg(formStore.IDCardInfo.PicField_44[0].url,formStore.IDCardInfo.PicField_44)" :src="formStore.IDCardInfo.PicField_44[0].url"></image>
              <uni-icons class="delImage" type="closeempty" color="#fff" size="22" @click.stop="formStore.IDCardInfo.PicField_44 = []"></uni-icons>
            </view>
          </view>
        </view>
      </view>
			<uni-forms-item label="客户名称">
        <uni-easyinput v-model="clientStore.IDCardForm.TextField_1" placeholderStyle="font-size:28rpx;" :inputBorder="false"  placeholder="请输入名称" />
      </uni-forms-item>
      <uni-forms-item label="出生日期">
        <picker class="picker" mode="date" :value="clientStore.IDCardForm.DateField_12" @change="changeBirthday">
          <view class="date">
            {{ clientStore.IDCardForm.DateField_12? clientStore.IDCardForm.DateField_12 : "请选择出生日期" }}
            <uni-icons class="pickerIcons" type="calendar" color="#A9A9A9" size="22"></uni-icons>
          </view>
        </picker>
      </uni-forms-item>
      <uni-forms-item label="性别">
        <picker class="picker" :range="sex" :value="sexSelect" @change="changeSex">
          <view class="date">
            {{ sexSelect===0 || sexSelect===1 ? sex[sexSelect] : "请选择性别" }}
            <uni-icons class="pickerIcons" type="forward" color="#A9A9A9" size="22"></uni-icons>
          </view>
        </picker>
      </uni-forms-item>
      <uni-forms-item label="民族">
        <uni-easyinput v-model="clientStore.IDCardForm.TextField_76"  placeholderStyle="font-size:28rpx;" :inputBorder="false"  placeholder="请输入名称" />
      </uni-forms-item>
      <uni-forms-item label="户籍地址">
        <uni-easyinput v-model="clientStore.IDCardForm.TextField_21" placeholderStyle="font-size:28rpx;" :inputBorder="false"  placeholder="请输入名称" />
      </uni-forms-item>
      <uni-forms-item label="证件号码" name="IdentityField_15">
        <uni-easyinput v-model="clientStore.IDCardForm.IdentityField_15" placeholderStyle="font-size:28rpx;" :inputBorder="false"  placeholder="请输入名称" />
      </uni-forms-item>
      <uni-forms-item label="证件有效期起">
        <picker class="picker" mode="date" :value="clientStore.IDCardForm.DateField_16" @change="changeIDCardStart">
          <view class="date">
            {{ clientStore.IDCardForm.DateField_16? clientStore.IDCardForm.DateField_16 : "请选择日期" }}
            <uni-icons class="pickerIcons" type="calendar" color="#A9A9A9" size="22"></uni-icons>
          </view>
        </picker>
      </uni-forms-item>
      <uni-forms-item label="证件有效期止">
        <view>
          <picker class="picker IdDate" mode="date"  :value="clientStore.IDCardForm.DateField_17"  @change="changeIDCardEnd">
            <view class="date">
              {{ clientStore.IDCardForm.DateField_17? clientStore.IDCardForm.DateField_17 : "请选择日期" }}
              <uni-icons class="pickerIcons" type="calendar" color="#A9A9A9" size="22"></uni-icons>
            </view>
          </picker>
          <view class="sperate"></view>
          <view class="idDateLength">
            <uni-data-checkbox selectedColor="#d4151f" multiple v-model="idLength" :localdata="IDlength"></uni-data-checkbox>
          </view>
        </view>
      </uni-forms-item>
      <uni-forms-item label="手机号码" required  name="PhoneField_9">
        <uni-easyinput v-model="clientStore.IDCardForm.PhoneField_9" placeholderStyle="font-size:28rpx;" :inputBorder="false"  placeholder="请输入手机号码" />
      </uni-forms-item>
      <view class="title">
        <view class="left">1.2 电站地址</view>
        <view class="right">
          <uni-icons type="top" size="22"></uni-icons>
          <!-- <uni-icons type="bottom" size="22"></uni-icons> -->
        </view>
      </view>
      <uni-forms-item label="地区" name="RegionField_20" required >
        <picker class="picker" mode="region" :value="reginSelect" @change="changeRegin">
          <view class="date">
            {{ reginSelect? `${reginSelect[0]} ${reginSelect[1]} ${reginSelect[2]}` : "请输入地址" }}
          </view>
        </picker>
      </uni-forms-item>
      <uni-forms-item label="电站地址（房屋产权地址)">
        <uni-easyinput v-model="clientStore.IDCardForm.TextField_84" placeholderStyle="font-size:28rpx;" :inputBorder="false"  placeholder="请输入名称" />
      </uni-forms-item>
      <view class="positionCard">
        <view class="showMap" @click="goMap" id="showMap">
          <view class="left">
            地址定位
          </view>
          <view class="right">
            <uni-icons class="pickerIcons" type="location-filled" color="#A9A9A9" size="22"></uni-icons>
          </view>
        </view>
      </view>
      <template v-if="clientStore.IDCardForm.PositionField_67?.staticPic">
        <PositionMap 
          :title="clientStore.IDCardForm.PositionField_67!.pName"
          :address="clientStore.IDCardForm.PositionField_67!.address"
          :location="clientStore.IDCardForm.PositionField_67!.location"
          :image="clientStore.IDCardForm.PositionField_67!.staticPic"
          @delete="deletePosition"
          >
        </PositionMap>
      </template>
      <button class="saveButton" type="submit" @click="submitForm">保存</button>
		</uni-forms>
    <view></view>  
  </view>
</template>

<style scoped lang="scss">
.saveButton {
  margin: 30rpx;
  background-color: #C7000B;
  color: #FFFFFF;
}
.IDcontent {
  padding: 25rpx 32rpx 0;
  .title {
    font-weight: 400;
    display: flex;
    justify-content: space-between;
    color: #221815;
    line-height: 40rpx;
    min-height: 40rpx;
    font-size: 28rpx;
    padding: 30rpx 0;
    font-weight: bold;
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
}
.pickerIcons{
    display: flex;
    flex: 1;
    justify-content: flex-end;
    font-size: 22rpx;
  }
#showMap {
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
  margin-top: 10px;
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
.IdDate {
  height: 78rpx;

}
.idDateLength {
  height: 78rpx;
  display: flex;
  align-items: center;
}
.sperate {
  width: 100%;
  height: 1px;
  background-color: #eee;
}
</style>
