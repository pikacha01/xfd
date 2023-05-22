<script setup lang="ts">
import { PropType,onMounted,ref } from 'vue'
import { FormCompnentData } from '@/constants/form'
import { useFormStore } from "@/store";
import uniDataSelect from "@/uniComponents/uni-data-select/uni-data-select.vue"
import { getInverterApi } from '@/api/modules/formInfo'


// 获取逆变器列表
const inverterList = ref<{ value: number, text: string }[]>()
let start = 0
let end = 60

onMounted(async() => {
  const res  = await getInverterApi(formStore.currentFormSteps!.processId,formStore.currentFormSteps!.stepId,formStore.currentFormSteps?.data.initData,start,end)
  console.log(res)
})

// 获取自定义的store
const formStore = useFormStore()

// 取需要的 state
const props = defineProps({
  data: {
    type:  Object as PropType<FormCompnentData>,
    required: true
  },
});
</script>

<template>
<uni-forms-item :label="data.label" :required="data.required" :name="data.id">
  
</uni-forms-item>
</template>

<style scoped lang="scss">

</style>
