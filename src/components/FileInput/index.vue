<script setup lang="ts">
import { PropType,ref,watch,onMounted } from 'vue'
import { FormCompnentData } from '@/constants/form'
import { useFormStore } from "@/store";
import user from "@/api/modules/user";
import { IfObsKey } from "@/constants/form";
import OBSupload from "@/utils/obs/upload";
import { previewImg } from '@/utils/imgPreview'

// 获取自定义的store
const formStore = useFormStore()

// 取需要的 state
const props = defineProps({
  data: {
    type:  Object as PropType<FormCompnentData>,
    required: true
  },
});


const preview = (fileLink) => {
  if (!fileLink) return
  uni.showLoading({ title: '加载中' })
  uni.downloadFile({
    url: fileLink,
    success: function (res) {
      if (res.statusCode != 200) {
        uni.hideLoading()
        uni.showToast({
          title: "加载失败",
          icon: 'error',
          duration: 2000
        })
        return false
      }
      const path = res.tempFilePath
      uni.openDocument({
        filePath: path,
          //@ts-ignore
          showMenu: true,
          success: function (res) {
              uni.hideLoading()
          }
      })
    }
  })
}

// 检测表单子传父事件
const emits = defineEmits(["checkForm"])

// 添加文件
const addFile =async () => {
  if (props.data.readonly || (Object.entries(formStore.currentFormSteps!.data.initData).length === 0)) return
  uni.chooseMessageFile({
    count: 9,
    async success(res) {
      uni.showLoading({ title: '上传中' })
      if (res.errMsg !== "chooseMessageFile:ok") {
        uni.hideLoading();
        uni.showToast({
          title: "选择失败",
          icon: 'error',
          duration: 2000
        })
        return
      }
      for (const key of res.tempFiles) {
            //@ts-ignore
            await user.getObsKey().then(async (data: IfObsKey) => {
            //@ts-ignore
            const fileObj = await OBSupload(key, data);
            if (!formStore.currentFormSteps?.data.initData[props.data.id]) {
              formStore.currentFormSteps!.data.initData[props.data.id] = []
              formStore.changeForm[props.data.id] = []
            }
            formStore.currentFormSteps?.data.initData[props.data.id].push(fileObj)
            // 检测表单子传父事件
            emits("checkForm")
        });
      }
      formStore.changeForm[props.data.id] = formStore.currentFormSteps?.data.initData[props.data.id]
      uni.hideLoading();
    }
  })
}

// 删除文件
const deleteFile = (item) => {
  if (props.data.readonly || (Object.entries(formStore.currentFormSteps!.data.initData).length === 0)) return
  formStore.currentFormSteps!.data.initData[props.data.id] = formStore.currentFormSteps!.data.initData[props.data.id].filter((data) => {
    return item.url !== data.url
  })
  formStore.changeForm[props.data.id] = formStore.currentFormSteps!.data.initData[props.data.id].filter((data) => {
    return item.url !== data.url
  })
  // 检测表单子传父事件
  emits("checkForm")
}

</script>

<template>
<uni-forms-item :label="data.label" :rules="[
      {
        required: data.required,
        errorMessage: `${data.label}不能为空`,
      },
    ]" :name="data.id">
  <view class="right">
    <template  v-for="item in formStore .currentFormSteps?.data.initData[props.data.id]" :key="item.url">
      <view class="delete">
        <view class="box">
          <image v-if="item.fileType.toLowerCase() === 'pdf'" @click="preview(item.url)" class="icon" mode="aspectFill" src="@/static/images/file_pdf.png"></image>
          <image @click="previewImg(item.url,formStore.currentFormSteps!.data.initData[props.data.id])" v-else-if="item.fileType.toLowerCase() === 'jpg' || item.fileType.toLowerCase() === 'png' || item.fileType.toLowerCase() === 'jpeg' || item.fileType.toLowerCase() === 'svg' || item.fileType.toLowerCase() === 'gif'" class="icon" mode="widthFix" :src="item.url"></image>
          <image v-else-if="item.fileType.toLowerCase() === 'ppt' || item.fileType.toLowerCase() === 'pptx'" @click="preview(item.url)" class="icon" mode="widthFix" src="@/static/images/file_ppt.png"></image>
          <image v-else-if="item.fileType.toLowerCase() === 'xlsx' || item.fileType.toLowerCase() === 'xls'" @click="preview(item.url)" class="icon" mode="widthFix" src="@/static/images/file_excel.png"></image>
          <image v-else-if="item.fileType.toLowerCase() === 'mp4' || item.fileType.toLowerCase() === 'avi' || item.fileType.toLowerCase() === 'flv'" @click="preview(item.url)" class="icon" mode="widthFix" src="@/static/images/file_type_video.png"></image>
        </view>
        <view class="deleteIcon" v-if="!data.readonly && !(Object.entries(formStore.currentFormSteps!.data.initData).length === 0)">
          <image class="icon" src="@/static/images/delete@2x.png" @click="deleteFile(item)"></image>
        </view>
      </view>
    </template>
    <view class="delete"  v-if="!data.readonly && !(Object.entries(formStore.currentFormSteps!.data.initData).length === 0)">
      <view class="box">
        <view class="add"  @click="addFile">
          <uni-icons type="plusempty" color="#cccccc" size="55"/>
        </view>
      </view>
    </view>
  </view>
</uni-forms-item>
</template>

<style scoped lang="scss">

.right {
  display: flex;
  box-sizing: border-box;
  flex-wrap: wrap;
  margin: -5px;
  .delete {
    position: relative;
    width: 33.3%;
    height: 0;
    padding-top: 33.33%;
    box-sizing: border-box;
    .box {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      margin: 5px;
      border: 1px #eee solid;
      overflow: hidden;
      border-width: 1px;
      border-style: solid;
      border-color: #eee;
      border-radius: 3px;
    }
    .icon {
      width: 100%;
      height: 100%;
    }
    .deleteIcon {
      position: absolute;
      right: 0;
      top: 0;
      .icon {
        width: 36rpx;
        height: 36rpx;
      }
    }
  }
  
}
.add {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
</style>
