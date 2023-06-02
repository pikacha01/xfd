<script setup lang="ts">
import { PropType,ref,watch } from 'vue'
import { FormCompnentData } from '@/constants/form'
import { useFormStore } from "@/store";

// 获取自定义的store
const formStore = useFormStore()

// 取需要的 state
const props = defineProps({
  data: {
    type:  Object as PropType<FormCompnentData>,
    required: true
  },
});


// 身份证长期有效
const IDlength = ref([{
  text: "长期有效",
  value: "1",
  disable: props.data.readonly || (Object.entries(formStore.currentFormSteps!.data.initData).length === 0)
}])

const idLength = ref<string []>([])

const change = (e) => {
  if (e.detail.value[0]) {
    formStore.currentFormSteps!.data.initData.SelectField_58 = ["1"] 
    // 改变赋值
    formStore.changeForm["SelectField_58"] = ["1"]
  } else {
    formStore.currentFormSteps!.data.initData.SelectField_58 = null
    formStore.changeForm["SelectField_58"] = null
  }
}

// 改变身份起止时间
const changeIDCardEnd = (e) => {
  formStore.currentFormSteps!.data.initData.DateField_17 = e.detail.value
  // 改变赋值
  formStore.changeForm["DateField_17"] = e.detail.value
}

</script>

<template>
<uni-forms-item label="证件有效期止">
  <view>
    <picker :disabled="data.readonly || (Object.entries(formStore.currentFormSteps!.data.initData).length === 0)"  class="picker IdDate" mode="date"  :value="formStore.currentFormSteps!.data.initData[props.data.id]"  @change="changeIDCardEnd">
      <view class="date">
        {{ formStore.currentFormSteps!.data.initData.DateField_17? formStore.currentFormSteps?.data.initData[data.id].substr(0,10): "请选择日期" }}
        <uni-icons class="pickerIcons" type="calendar" color="#A9A9A9" size="22"></uni-icons>
      </view>
    </picker>
    <view class="sperate"></view>
    <view class="idDateLength">
      <uni-data-checkbox @change="change" selectedColor="#d4151f" multiple v-model="idLength" :localdata="IDlength"></uni-data-checkbox>
    </view>
  </view>
</uni-forms-item>
</template>

<style scoped lang="scss">
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
    justify-content: space-between;
  }
}
.IdDate {
  height: 78rpx;

}
.sperate {
  width: 100%;
  height: 1px;
  background-color: #eee;
}
.idDateLength {
  height: 78rpx;
  display: flex;
  align-items: center;
}

</style>
