<script setup lang="ts">
import { PropType,ref,onMounted } from 'vue'
import { FormCompnentData } from '@/constants/form'
import { useCountStore, useFormStore } from "@/store";
import uniDataSelect from '@/uniComponents/uni-data-select/uni-data-select.vue'
import { getAddressDetailApi } from '@/api/modules/formInfo'

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

const  reginSelect = ref<string[]>()

// 检测表单子传父事件
const emits = defineEmits(["checkForm"])

onMounted(async() => {
  const res = await getAddressDetailApi(formStore.currentFormSteps!.data.initData[props.data.id])
  console.log(res)
  //@ts-ignore
  reginSelect.value = res.map(item => {
    return item.name
  })
})
// 改变地区
const changeRegin = (e) => {
  formStore.currentFormSteps!.data.initData[props.data.id] = e.detail.code
  reginSelect.value = e.detail.value
  // 改变赋值
  formStore.changeForm[props.data.id] = e.detail.code
  // 检测表单子传父事件
  emits("checkForm")
}
</script>

<template>
  <uni-forms-item v-if="data.id === 'PhoneField_9'" :label="data.label" :name="data.id" :required="data.required" >
    <picker :disabled="data.readonly || (Object.entries(formStore.currentFormSteps!.data.initData).length === 0)" class="picker" mode="region" :value="data" @change="changeRegin">
      <view class="date" v-if="reginSelect">
        {{ reginSelect[0]? `${reginSelect[0]} ${reginSelect[1]} ${reginSelect[2]}` : "请输入地址" }}
      </view>
    </picker>
  </uni-forms-item>
  <uni-forms-item v-else :label="data.label" :name="data.id" :rules="[
    {
      required: data.required,
      errorMessage: `${data.label}不能为空`,
    },
  ]" >
    <picker :disabled="data.readonly || (Object.entries(formStore.currentFormSteps!.data.initData).length === 0)" class="picker" mode="region" :value="data" @change="changeRegin">
      <view class="date" v-if="reginSelect">
        {{ reginSelect[0]? `${reginSelect[0]} ${reginSelect[1]} ${reginSelect[2]}` : "请输入地址" }}
      </view>
    </picker>
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
