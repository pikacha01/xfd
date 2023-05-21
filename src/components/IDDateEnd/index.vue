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
  disable: props.data.readonly
}])

console.log(IDlength)

const idLength = ref<string []>([])

watch(() => {
  return idLength[0]
}, () => {
  idLength.value[0] === "1" ? formStore.newFormSteps!.data.initData.SelectField_58 = ["1"] : formStore.newFormSteps!.data.initData.SelectField_58 = null
})

// 改变身份起止时间
const changeIDCardEnd = (e) => {
  formStore.newFormSteps!.data.initData.DateField_17 = e.detail.value
}

</script>

<template>
<uni-forms-item label="证件有效期止">
  <view>
    <picker :disabled="data.readonly"  class="picker IdDate" mode="date"  :value="formStore.newFormSteps!.data.initData[props.data.id]"  @change="changeIDCardEnd">
      <view class="date">
        {{ formStore.newFormSteps!.data.initData.DateField_17? formStore.newFormSteps?.data.initData[data.id].substr(0,10): "请选择日期" }}
        <uni-icons class="pickerIcons" type="calendar" color="#A9A9A9" size="22"></uni-icons>
      </view>
    </picker>
    <view class="idDateLength">
      <uni-data-checkbox selectedColor="#d4151f" multiple v-model="idLength" :localdata="IDlength"></uni-data-checkbox>
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

</style>
