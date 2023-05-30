<script setup lang="ts">
import { PropType } from 'vue'
import { FormCompnentData } from '@/constants/form'
import { ValidtorUniqueData } from "@/utils/validate";
import { useCountStore,useFormStore } from "@/store";
import { storeToRefs } from "pinia";

// 获取自定义的store
const store = useCountStore();
const formStore = useFormStore()

// 取需要的 state
const { companyId, formId } = storeToRefs(store);
const props = defineProps({
  data: {
    type:  Object as PropType<FormCompnentData>,
    required: true
  },
});

const changeDate = (e) => {
  formStore.currentFormSteps!.data.initData[props.data.id] = e.detail.value
  // 改变赋值
  formStore.changeForm[props.data.id] = e.detail.value
}

</script>

<template>
<uni-forms-item :label="data.label" :name="data.id" :rules="[
    {
      required: data.required,
      errorMessage: `${data.label}不能为空`,
    },
  ]">
  <picker class="picker" :disabled="data.readonly || (Object.entries(formStore.currentFormSteps!.data.initData).length === 0)" mode="date" :value="formStore.currentFormSteps?.data.initData[data.id]" @change="changeDate">
    <view class="date">
      {{ formStore.currentFormSteps?.data.initData[data.id] ? formStore.currentFormSteps?.data.initData[data.id].substr(0,10) : data.placeholder}}
      <uni-icons class="pickerIcons" type="calendar" color="#A9A9A9" size="22"></uni-icons>
    </view>
  </picker>
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
.pickerIcons{
    display: flex;
    flex: 1;
    justify-content: flex-end;
    font-size: 22rpx;
  }
</style>
