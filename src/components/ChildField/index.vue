<script setup lang="ts">
import { PropType,computed,onMounted,ref } from 'vue'
import { FormCompnentData } from '@/constants/form'
import { useFormStore } from "@/store";
import { getUserDetailStepAPi } from '@/api/modules/formInfo'
import { getSNCodeList } from '@/api/modules/formInfo'


// 获取自定义的store
const formStore = useFormStore()

// 取需要的 state
const props = defineProps({
  data: {
    type:  Object as PropType<FormCompnentData>,
    required: true
  },
});

const total = ref<number>(0)


const formView =  {
  viewId: "797373861394317313",
  form: "JoinField_59"
}


onMounted(async () => {
  getTotal()
  const res = await getSNCodeList(formStore.currentFormSteps!.processId, formStore.currentFormSteps!.stepId)
  //@ts-ignore
  formStore.SNCurrentTotal = res.total
})

const percentage = computed(() => {
  if(formStore.SNCurrentTotal === null || formStore.SNCurrentTotal === undefined) return 0
  return Number((formStore.SNCurrentTotal / total.value * 100).toFixed(2))
})

// 获取总数
const getTotal = async () =>{
  const res = await getUserDetailStepAPi(formStore.newFormSteps!.processId,formStore.newFormSteps!.stepId,formView.form,formView.viewId)
  //@ts-ignore
  total.value = res.data.initData["NumberField_74"]  ? res.data.initData["NumberField_74"] : 0
}

// 跳转页面
const goToScan = () => {
  // if(props.data.readonly  || (Object.entries(formStore.currentFormSteps!.data.initData).length === 0)) return
  uni.navigateTo({
    url: `/pages/TableList?readonly=${props.data.readonly  || (Object.entries(formStore.currentFormSteps!.data.initData).length === 0)}`
  })
}

</script>

<template>
<uni-forms-item :label="data.label" :name="data.id" :required="data.required">
  <view class="progressBox" @click="goToScan">
    <progress class="progress" :percent="percentage" stroke-width="3" activeColor="#C7000B"/>
    <view class="num">{{ formStore.SNCurrentTotal  === null || formStore.SNCurrentTotal === undefined ? 0 : formStore.SNCurrentTotal }} / {{ total }}</view>
    <uni-icons class="num" type="camera" color="#A9A9A9" size="22"></uni-icons>
    <uni-icons class="num" type="forward" color="#A9A9A9" size="22"></uni-icons>
  </view>
</uni-forms-item>
</template>

<style scoped lang="scss">
.progressBox {
  display: flex;
  align-items: center;
  height: 100%;
  .progress {
    flex: 1;
  }
  .num {
    font-size: 28rpx;
    margin-left: 16rpx;
    color: #A9A9A9;
  }
}
</style>
