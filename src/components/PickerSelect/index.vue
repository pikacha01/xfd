<script setup lang="ts">
import { PropType,ref,watch } from 'vue'
import { FormCompnentData } from '@/constants/form'
import { useCountStore, useFormStore } from "@/store";
import uniDataSelect from '@/uniComponents/uni-data-select/uni-data-select.vue'

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

const inputData = ref(formStore.newFormSteps?.data.initData[props.data.id])

watch(()=>{
  return inputData.value
}, () => {
  formStore.newFormSteps!.data.initData[props.data.id] = inputData.value
})

const selectList = props.data.items!.map((item) => {
  return {
    text: item.label,
    value: item.value
  }
})

</script>

<template>
<uni-forms-item :label="data.label">
  <uni-data-select
      :disabled="data.readonly"
      v-model="inputData"
      :localdata="selectList"
      :placeholder="data.placeholder"
      :clear="false"
    />
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
