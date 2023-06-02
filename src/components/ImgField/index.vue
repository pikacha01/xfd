<script setup lang="ts">
import { PropType,ref,watch,onMounted } from 'vue'
import { FormCompnentData } from '@/constants/form'
import { useFormStore } from "@/store";
import user from "@/api/modules/user";
import { IfObsKey } from "@/constants/form";
import OBSupload from "@/utils/obs/upload";
import uniFilePicker from "@/uniComponents/uni-file-picker/uni-file-picker.vue"

// 获取自定义的store
const formStore = useFormStore()

// 取需要的 state
const props = defineProps({
  data: {
    type:  Object as PropType<FormCompnentData>,
    required: true
  },
});

const ImgList = ref<{
  name: string,
  extname: string,
  url: string,
  // size: number
}[]>([])

onMounted(() => {
  ImgList.value = []
  if (formStore.currentFormSteps?.data.initData[props.data.id]) {
    formStore.currentFormSteps?.data.initData[props.data.id].forEach((item) => {
      const temp = {
        name: item.fileName,
        extname: item.fileType,
        url: item.url,
        size: item.size
      }
      ImgList.value.push(temp)
    })
  }
})

const select = async (e) => {
  if (!formStore.currentFormSteps?.data.initData[props.data.id]) {
    formStore.currentFormSteps!.data.initData[props.data.id] = []
  }
  for (const key of e.tempFiles) {
    //@ts-ignore
    await user.getObsKey().then(async (data: IfObsKey) => {
    //@ts-ignore
    const fileObj = await OBSupload(key.file, data);
     formStore.currentFormSteps?.data.initData[props.data.id].push(fileObj)
    });
  }
}

const deleteImg = (e) => {
  formStore.currentFormSteps!.data.initData[props.data.id].forEach((item,index) => {
    if (item.url === e.tempFilePath) {
      formStore.currentFormSteps!.data.initData[props.data.id].splice(index, 1)
    }
  })
}

watch(() => {
  return formStore.currentFormSteps?.data.initData[props.data.id]
}, () => {
  ImgList.value = []
  if (formStore.currentFormSteps?.data.initData[props.data.id]) {
    formStore.currentFormSteps?.data.initData[props.data.id].forEach((item) => {
      const temp = {
        name: item.fileName,
        extname: item.fileType,
        url: item.url,
        size: item.size
      }
      ImgList.value.push(temp)
    })
  }
  // 改变赋值
  if(formStore.currentFormSteps?.data.initData[props.data.id] === undefined) return 
  formStore.changeForm[props.data.id] = formStore.currentFormSteps?.data.initData[props.data.id]
},{deep:true})

</script>

<template>
<uni-forms-item :label="data.label" :rules="[
    {
      required: data.required,
      errorMessage: `${data.label}不能为空`,
    },
  ]" :name="data.id">
  <uni-file-picker @delete="deleteImg" @select="select"  file-mediatype="image" :readonly="data.readonly || (Object.entries(formStore.currentFormSteps!.data.initData).length === 0)" :modelValue="ImgList"></uni-file-picker>
</uni-forms-item>
</template>

<style scoped lang="scss">

</style>
