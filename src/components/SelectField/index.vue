<template>
  <view class="uni-form-item">
    <uni-forms-item
      :label="data.label"
      :name="data.id"
      :rules="[
        {
        required: data.required,
        errorMessage: `${data.label}不能为空`,
      },
      ]"
    >
      <uni-data-checkbox multiple v-model="selectData" :localdata="localData"></uni-data-checkbox>
    </uni-forms-item>
  </view>
</template>

<script lang="ts" setup>
import {  PropType,onMounted,ref,watch } from "vue";
import { FormCompnentData } from '@/constants/form'
import { useFormStore } from "@/store";

// 取需要的 state
const props = defineProps({
  data: {
    type:  Object as PropType<FormCompnentData>,
    required: true
  },
});

// 获取自定义的store
const formStore = useFormStore()
// 数据
const localData = ref<{
  text: string,
  value: string,
  disable: boolean
}[]>([])

// 选择的数据
const selectData = ref<string[]>([])

// 检测表单子传父事件
const emits = defineEmits(["checkForm"])

onMounted(() => {
  localData.value = props.data.items!.map(item => {
    return {
      text: item.label,
      value: item.value,
      disable: props.data.readonly || (Object.entries(formStore.currentFormSteps!.data.initData).length === 0)
    }
  })
  selectData.value = formStore.currentFormSteps?.data.initData[props.data.id]
  watch(() => {
    return selectData.value
  }, () => { 
    // 改变赋值
    formStore.changeForm[props.data.id] = selectData.value
    // 检测表单子传父事件
    emits("checkForm")
  },{deep: true})
});
</script>

<style lang="scss">
</style>
