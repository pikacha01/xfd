<script setup lang="ts">
import { PropType,ref,watch } from 'vue'
import { FormCompnentData } from '@/constants/form'
import { useFormStore } from "@/store";
import uniEasyinput from "@/uniComponents/uni-easyinput/uni-easyinput.vue"

// 获取自定义的store
const formStore = useFormStore()

// 取需要的 state
const props = defineProps({
  data: {
    type:  Object as PropType<FormCompnentData>,
    required: true
  },
});
// 
const inputData = ref(formStore.currentFormSteps?.data.initData[props.data.id])

watch(() => {
  return inputData
},()=>{
  formStore.currentFormSteps!.data.initData[props.data.id] = inputData.value
})
</script>

<template>
<uni-forms-item :label="data.label" :required="data.required" :name="data.id">
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
