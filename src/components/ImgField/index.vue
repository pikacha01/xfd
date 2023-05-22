<script setup lang="ts">
import { PropType,ref,watch,onMounted } from 'vue'
import { FormCompnentData } from '@/constants/form'
import { useFormStore } from "@/store";
import uniFilePicker from "../../../node_modules/@dcloudio/uni-ui/lib/uni-file-picker/uni-file-picker.vue"

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
  formStore.currentFormSteps?.data.initData[props.data.id].forEach((item) => {
    const temp = {
      name: item.fileName,
      extname: item.fileType,
      url: item.url,
      // size: item.size
    }
    ImgList.value.push(temp)
    console.log(ImgList.value)
  })
})

const select = (e) => {
  console.log(e)
}

</script>

<template>
<uni-forms-item :label="data.label" :required="data.required" :name="data.id">
  <uni-file-picker @select="select" file-mediatype="image" :readonly="data.readonly" :value="ImgList"></uni-file-picker>
</uni-forms-item>
</template>

<style scoped lang="scss">

</style>
