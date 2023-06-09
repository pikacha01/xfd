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
let selectArray = []

const getSelectList = async () => { 
  const res  = await getInverterApi(formStore.currentFormSteps!.processId,formStore.currentFormSteps!.stepId,formStore.currentFormSteps?.data.initData,start,end)
  //@ts-ignore
  selectArray = [...selectArray, ...res.datas]
  //@ts-ignore
  if (selectArray.length < res.total) {
    start = end + 60
    end = end + 60
    getSelectList()
  } else {
    selectList.value = selectArray.map(item => {
      return {
        //@ts-ignore
        value: item.id,
        //@ts-ignore
        text: item.TextField_1
      }
    })
  }
}

onMounted(async () => {
  selectArray = []
  start = 0
  end = 60
  if(formStore.currentFormSteps?.data.initData[props.data.id]) inverterSelect.value = formStore.currentFormSteps?.data.initData[props.data.id][0]
  await getSelectList()
})


// 获取自定义的store
const formStore = useFormStore()
// 选中的逆变器
const inverterSelect = ref<number>()

// 检测表单子传父事件
const emits = defineEmits(["checkForm"])

watch(() => {
  return formStore.currentFormSteps?.data.initData[props.data.id]
}, () => {
  if (formStore.currentFormSteps?.data.initData[props.data.id][0]) {
    inverterSelect.value = formStore.currentFormSteps?.data.initData[props.data.id][0]
  }
},{deep: true})


const changeSelect = (e) => {
  if (e) {
    formStore.currentFormSteps!.data.initData[props.data.id] = []
    formStore.currentFormSteps!.data.initData[props.data.id][0] = e
    // 改变赋值
    formStore.changeForm[props.data.id] = []
    formStore.changeForm[props.data.id][0] = e
    // 检测表单子传父事件
    emits("checkForm")
  }
}
</script>

<template>
<uni-forms-item :label="data.label" :rules="[
      {
        required: data.required,
        errorMessage: `${data.label}不能为空`,
      },
    ]" :name="data.id">
  <uni-data-select
    :disabled="data.readonly || (Object.entries(formStore.currentFormSteps!.data.initData).length === 0)"
    v-model="inverterSelect"
    :localdata="selectList"
    :clear="false"
    @change="changeSelect"
  ></uni-data-select>
</uni-forms-item>
</template>

<style scoped lang="scss">

</style>
