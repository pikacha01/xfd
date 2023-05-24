<script setup lang="ts">
import { PropType,onMounted,ref,watch } from 'vue'
import { FormCompnentData } from '@/constants/form'
import { useFormStore } from "@/store";
import uniDataSelect from "@/uniComponents/uni-data-select/uni-data-select.vue"
import { getInverterApi } from '@/api/modules/formInfo'
// 取需要的 state
const props = defineProps({
  data: {
    type:  Object as PropType<FormCompnentData>,
    required: true
  },
});

// 获取逆变器列表
const selectList = ref<{ value: number, text: string }[]>()
let start = 0
let end = 60

onMounted(async () => {
  if(formStore.currentFormSteps?.data.initData[props.data.id]) inverterSelect.value = formStore.currentFormSteps?.data.initData[props.data.id][0]
  const res  = await getInverterApi(formStore.currentFormSteps!.processId,formStore.currentFormSteps!.stepId,formStore.currentFormSteps?.data.initData,start,end)
  //@ts-ignore
  selectList.value = res.datas.map(item => {
    return {
      value: item.id,
      text: item.TextField_1
    }
  })
  console.log(selectList.value)
  console.log(props.data.readonly)
})

// 获取自定义的store
const formStore = useFormStore()
// 选中的逆变器
const inverterSelect = ref<number>()


watch(() => {
  return formStore.currentFormSteps?.data.initData[props.data.id]
}, () => {
  inverterSelect.value = formStore.currentFormSteps?.data.initData[props.data.id][0]
},{deep: true})


const changeSelect = (e) => {
  formStore.currentFormSteps!.data.initData[props.data.id] = []
  formStore.currentFormSteps!.data.initData[props.data.id][0] = e
}
</script>

<template>
<uni-forms-item :label="data.label" :required="data.required" :name="data.id">
  <uni-data-select
    :disabled="data.readonly"
    v-model="inverterSelect"
    :localdata="selectList"
    :clear="false"
    @change="changeSelect"
  ></uni-data-select>
</uni-forms-item>
</template>

<style scoped lang="scss">

</style>
