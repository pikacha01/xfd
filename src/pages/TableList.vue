<script setup lang="ts">
import { useFormStore } from "@/store";
import { ref,onMounted } from 'vue'
import { onLoad } from "@dcloudio/uni-app";
import { stepUploadApi,upCodeStep,getSNCodeList,deleteCodeStep } from '@/api/modules/formInfo'

const readonly = ref<string>()

onLoad((option) => {
  readonly.value = option.readonly
})


onMounted(async () => {
  const res = await getSNCodeList(formStore.currentFormSteps!.processId, formStore.currentFormSteps!.stepId)
  if(res.data === null) return
  //@ts-ignore
  deviceList.value = res.datas
  //@ts-ignore
  formStore.SNCurrentTotal = res.total
})


// 获取自定义的store
const formStore = useFormStore()

const checkedList = ref<string[]>([])

const selectionChange = (e) => {
  if (readonly.value === "true") {
    uni.showToast({
      title: '当前只读状态！',
      icon:'error'
    })
    return
  }
  checkedList.value = e.detail.value
}

// 设备列表
const deviceList = ref<{
  TextField_1: string,
  id: number
}[]>([])


// 删除
const deleteCode = () => {
  if(checkedList.value.length === 0 ) return
  if (readonly.value === "true") {
    uni.showToast({
      title: '当前只读状态！',
      icon:'error'
    })
    return
  }
  uni.showModal({
    title: '提示',
    content: '确定需要删除吗？',
    confirmColor: "#C7000B",
    success: async function (res) {
        if (res.confirm) {
          checkedList.value.forEach(async (item) => {
            const index = formStore.currentFormSteps!.data.initData['ChildTableField_28'].findIndex((data)=> data === item )
            formStore.currentFormSteps!.data.initData['ChildTableField_28'].splice(index, 1)
            deviceList.value = deviceList.value!.filter(filter => {
              return String(filter.id) !== item
            })
            await deleteCodeStep(formStore.currentFormSteps!.processId, formStore.currentFormSteps!.stepId, [item])
            formStore.SNCurrentTotal = formStore.SNCurrentTotal - 1
          })
        } else if (res.cancel) {
          uni.showToast({
            title: '删除失败',
            icon: 'none',
            duration: 2000
          })
        }
      }
    });
}

// 扫码
const scanCode = () => {
  if (readonly.value === "true") {
    uni.showToast({
      title: '当前只读状态！',
      icon:'error'
    })
    return
  }
  uni.scanCode({
    success: async function (code) {
      if(!deviceList.value) {
        deviceList.value = []
      }
      const index = deviceList.value.findIndex(item => String(item.TextField_1) === code.result)
      if (index !== -1) {
        uni.showToast({
          title: '已存在！',
          icon:'error'
        })
      } else {
        const data = await upCodeStep(formStore.currentFormSteps!.processId, formStore.currentFormSteps!.stepId)
        //@ts-ignore
        await stepUploadApi(data!.processId, data!.stepId, {
          //@ts-ignore
          JoinField_9: data.data.initData.JoinField_9,
          TextField_1: code.result,
          TextField_2: null
        })
        const res = await getSNCodeList(formStore.currentFormSteps!.processId, formStore.currentFormSteps!.stepId)
        //@ts-ignore
        deviceList.value = res.datas
        formStore.SNCurrentTotal = formStore.SNCurrentTotal + 1
        uni.showToast({
          title: '扫码成功',
          icon:'success',
          duration: 2000
        })
      }
    }, fail(res) {
      uni.showToast({
        title: '扫描失败',
        icon: 'none',
        duration: 2000
      })
    }
  });
}
</script>

<template>
<view class="all">
  <view class="content" :class="{'Bottom': readonly !== 'true'}">
    <checkbox-group @change="selectionChange">
      <view class="table" v-for="item in deviceList" :key="item.id">
        <checkbox :value="item.id"  color="#C7000B" style="transform:scale(0.7)" />
        <text class="SN">组件SN</text>
        <text class="Code">{{ item.TextField_1 }}</text>
      </view>
    </checkbox-group>
  </view>
  <view class="button" v-if="readonly !== 'true'">
    <view class="buttons">
      <view class="delete" @click="deleteCode">
        删除
      </view>
      <view class="save" @click="scanCode">
        <uni-icons class="num" type="camera" color="#221815;" size="20"></uni-icons>
        扫码
      </view>
    </view>
  </view>
</view>
</template>

<style scoped lang="scss">
.all {
  background-color: #f6f7f9;
  width: 100vw;
}
.content {
  margin: 0 32rpx;
  min-height: 100vh;
}
.Bottom {
  padding-bottom: 190rpx;
}
.table {
  width: 100%;
  display: flex;
  height: 78rpx;
  font-size: 28rpx;
  color: #595757;
  align-items: center;
  border-bottom: 2rpx solid #E9E9E9;
  .SN {
    margin-left: 25rpx;
    margin-right: 75rpx;
  }
}
.button {
  position: fixed;
  bottom: 0;
  z-index: 10;
  width: 100%;
  height: 190rpx;
  background-color: #F6F7F9;
  .buttons {
    width: 100%;
    padding: 20rpx 78rpx 0;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    font-size: 28rpx;
    .delete {
      display: flex;
      justify-content: center;
      align-items: center;
      color: #C7000B;
      width: 240rpx;
      height: 80rpx;
      border-radius: 4rpx;
      border: 2rpx solid #C7000B;
    }
    .save {
      display: flex;
      justify-content: center;
      align-items: center;
      color: #221815;
      width: 240rpx;
      height: 80rpx;
      border-radius: 4rpx;
      border: 2rpx solid #221815;
    }
  }
}
// .table:not(:last-child) { 
//     background-color:peachpuff; 
//     color: white;
// }
</style>
