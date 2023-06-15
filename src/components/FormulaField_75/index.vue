<script setup lang="ts">
import { computed,PropType } from 'vue'
import { useFormStore } from "@/store";
import { FormCompnentData } from '@/constants/form'
import uniEasyinput from "@/uniComponents/uni-easyinput/uni-easyinput.vue"

const formStore = useFormStore()

// 取需要的 state
const props = defineProps({
  data: {
    type:  Object as PropType<FormCompnentData>,
    required: true
  },
});


const calculate = computed(() => {
  if(formStore.currentFormSteps?.data.initData.NumberField_73 === null || formStore.currentFormSteps?.data.initData.NumberField_73 === undefined || formStore.currentFormSteps?.data.initData.NumberField_74 === null || formStore.currentFormSteps?.data.initData.NumberField_74 === undefined) return 0.0
  return Number(formStore.currentFormSteps?.data.initData.NumberField_73) * Number(formStore.currentFormSteps?.data.initData.NumberField_74) / 1000
})

</script>

<template>
<uni-forms-item :label="data.label" :required="data.required" :name="data.id">
  <view class="inputContainer">
    <uni-easyinput 
    trim="all"
    placeholderStyle="font-size:28rpx;" 
    v-model="calculate"
    :inputBorder="false"  
    disabled
    />
    <view v-if="data.unit">{{ data.unit }}</view>
  </view>
</uni-forms-item>
</template>

<style scoped lang="scss">
.inputContainer {
  display: flex;
  align-items: center;
}
</style>
