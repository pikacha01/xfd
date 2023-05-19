<script setup lang="ts">
import { PropType,ref,watch } from 'vue'
import { FormCompnentData } from '@/constants/form'
import { ValidtorUniqueData } from "@/utils/validate";
import { useCountStore,useFormStore } from "@/store";
import { storeToRefs } from "pinia";

// 获取自定义的store
const store = useCountStore();
const formStore = useFormStore()

// 取需要的 state
const props = defineProps({
  data: {
    type:  Object as PropType<FormCompnentData>,
    required: true
  },
});

const inputData = ref()

watch(() => {
  return inputData
},()=>{
  formStore.newFormSteps!.data.initData[props.data.id] = inputData.value
})
</script>

<template>
<uni-forms-item :label="data.label" :required="data.required"  :name="data.id">
  <uni-easyinput 
  placeholder="data.placeholder"  
  v-model="inputData" 
  placeholderStyle="font-size:28rpx;" 
  :disabled="data.readonly"
  :inputBorder="false"/>
</uni-forms-item>
</template>

<style scoped lang="scss">

</style>
