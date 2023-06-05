<script setup lang="ts">
import { PropType,ref,watch } from 'vue'
import { FormCompnentData } from '@/constants/form'
import { useFormStore } from "@/store";
import uniEasyinput from "@/uniComponents/uni-easyinput/uni-easyinput.vue"

// 获取自定义的store
const formStore = useFormStore()

// 检测表单子传父事件
const emits = defineEmits(["checkForm"])


// 取需要的 state
const props = defineProps({
  data: {
    type:  Object as PropType<FormCompnentData>,
    required: true
  },
});
// 映射对应的值
const inputData = ref()

inputData.value = formStore.currentFormSteps?.data.initData[props.data.id]

// 防抖
const debounce = (fn: Function) => {
  let time;
  return () => {
    clearTimeout(time);
    time = setTimeout(() => {
      fn()
    }, 300);
  };
};

watch(() => {
  return inputData.value
}, debounce(() => {
    if(formStore.currentFormSteps?.data.initData[props.data.id] === inputData.value) return
    // 改变对应的值
    formStore.currentFormSteps!.data.initData[props.data.id] = inputData.value
    // 改变赋值
    formStore.changeForm[props.data.id] = inputData.value
    // 检测表单子传父事件
    emits("checkForm")
  })
)
</script>

<template>
<uni-forms-item v-if="data.id === 'PhoneField_9' || data.id === 'IdentityField_15'" :label="data.label" :required="data.required" :name="data.id">
  <uni-easyinput 
   trim="all"
   placeholderStyle="font-size:28rpx;" 
   v-model="inputData"
   :inputBorder="false"  
   :placeholder="data.placeholder" 
   :disabled="data.readonly || (Object.entries(formStore.currentFormSteps!.data.initData).length === 0)"
   />
</uni-forms-item>
<uni-forms-item v-else :label="data.label" 
  :rules="[
      {
        required: data.required,
        errorMessage: `${data.label}不能为空`,
      },
    ]"
  :name="data.id">
  <uni-easyinput 
   placeholderStyle="font-size:28rpx;" 
   v-model="inputData"
   :inputBorder="false"  
   :placeholder="data.placeholder" 
   :disabled="data.readonly || (Object.entries(formStore.currentFormSteps!.data.initData).length === 0)"
   />
</uni-forms-item>
</template>

<style scoped lang="scss">

</style>
