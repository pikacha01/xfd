<script setup lang="ts">
import {onMounted} from 'vue'
import Steps from '@/components/steps/index.vue'
import IDForm from '@/components/IDCardForm/index.vue'
import {useFormStore} from '@/store'
import { onLoad } from "@dcloudio/uni-app"


const formStore = useFormStore()

onLoad(() => {
  uni.setNavigationBarTitle({
    title: "新增农户"
  })
  formStore.getNewClient()
})
onMounted(() => {
  formStore.IDCardInfo.PicField_43 = []
  formStore.IDCardInfo.PicField_44 = []
})  

</script>

<template>
  <view>
    <Steps :current-step="0"></Steps>
    <view class="content">
      <IDForm ></IDForm>
    </view>
  </view>
</template>

<style scoped lang="scss">
.content {
  background-color: #f6f7f9;
  width: 100%;
}
</style>
