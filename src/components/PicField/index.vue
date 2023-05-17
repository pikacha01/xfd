<template>
  <view class="uni-form-item">
    <uni-forms-item
      :name="props.item.id"
      :rules="[
        {
          required: props.item.required,
          errorMessage: `${props.item.label}不能为空`,
        },
      ]"
    >
      <template #label>
        <custom-label :item="props.item"></custom-label>
      </template>
      <button
        class="primary-button"
        hover-class="primary-hover"
        size="mini"
        @click="selectImg"
        v-if="props.item.quantity ? true : model.values.length ? false : true"
      >
        上传图片
      </button>
    </uni-forms-item>
    <view class="container">
      <ksp-cropper
        mode="ratio"
        :width="Number(model.ratio[0])"
        :height="Number(model.ratio[1])"
        :maxWidth="1024"
        :maxHeight="1024"
        :url="model.cropperUrl"
        @cancel="oncancel"
        @ok="onok"
      ></ksp-cropper>
    </view>
    <progress
      :percent="model.percent"
      show-info
      stroke-width="3"
      v-if="model.percent"
    ></progress>
    <view class="showImgList">
      <template v-for="(item, index) in model.values" :key="item.fileName">
        <view class="imgItem mr10 mb10">
          <image
            mode="aspectFit"
            :src="item.url"
            class="showimg"
            @click="preview(item)"
          />
          <view class="close" @click="deleteImg(index)">
            <uni-icons type="closeempty" class="ml5" color="#fff" />
          </view>
        </view>
      </template>
    </view>
    <hpy-watermark
      ref="watermarkRef"
      markAlign="topLeft"
      @waterMark="waterMark"
    ></hpy-watermark>
  </view>
</template>

<script lang="ts" setup>
import user from "@/api/modules/user";
import { reactive, ref, watch } from "vue";
import kspCropper from "@/common/ksp-cropper/ksp-cropper.vue";
import hpyWatermark from "@/common/hpy-watermark/hpy-watermark.vue";
import OBSupload from "@/utils/obs/upload";
import { FileInfo } from "@/constants/form";
import { useCountStore } from "@/store";
import { storeToRefs } from "pinia";

interface Model {
  cropperUrl: string;
  showImg: string;
  imgList: Array<any>;
  ratio: Array<string>;
  values: Array<FileInfo>;
  canvasId: string;
  percent: number;
}
const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  value: {
    type: Object,
    required: true,
  },
});

// 获取自定义的store
const store = useCountStore();

// 取需要的 state
const { companyInfo } = storeToRefs(store);

const model: Model = reactive({
  values: [],
  cropperUrl: "",
  imgList: [],
  cropperFile: [],
  showImg: "",
  ratio: [],
  canvasId: "",
  percent: 0,
});

// 确认裁剪
function onok(ev) {
  model.imgList[0].url = ev.path;
  oncancel();
  if (props.item.marker.length) {
    getMessList().then(res => {
      if (res.length) {
        draw(res);
      } else {
        uploadImgIng();
      }
    });
  } else {
    uploadImgIng();
  }
}

function uploadImgIng() {
  uploadImg([
    {
      path: model.imgList[0].url,
      size: model.imgList[0].size,
    },
  ]);
}
const watermarkRef = ref(null);

// 加水印后的
function waterMark(filePath) {
  //  #ifndef H5
  uploadImg([
    {
      size: 10244,
      path: filePath,
    },
  ]);
  //  #endif
  //  #ifdef  H5
  uploadImg([
    {
      size: dataURLtoFile(filePath, "1").size,
      path: filePath,
    },
  ]);
  //  #endif
}

function dataURLtoFile(dataurl, filename) {
  //将base64转换为文件
  var arr = dataurl.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

// 删除图片
function deleteImg(index: number) {
  model.values.splice(index, 1);
}
// 预览图片
function preview(item) {
  uni.previewImage({
    current: item.url,
    urls: model.values.map(({ url }) => url),
  });
}
//取消裁剪
function oncancel() {
  model.cropperUrl = "";
}
/**
 * 多张选         单张选
 *      从那里选
 *       裁剪
 *      加水印
 *      上传
 */
function selectImg() {
  uni.chooseImage({
    count: props.item.cropper ? 1 : props.item.quantity ? 9 : 1,
    sourceType: chooseMode(props.item.mode),
    success: ({ tempFiles, tempFilePaths }) => {
      // 裁剪
      if (props.item.cropper) {
        model.cropperUrl = tempFilePaths[0];
        model.ratio = props.item.cropperSize.split(":");

        model.imgList = [
          {
            url: tempFiles[0].path,
            size: tempFiles[0].size,
          },
        ];
      } else {
        //@ts-ignore
        model.imgList = tempFiles.map(item => ({
          url: item.path,
          size: item.size,
        }));
        if (props.item.marker.length == 0) {
          uploadImg(tempFiles);
        } else {
          // 需要加水印
          getMessList().then(res => {
            if (res.length) {
              draw(res);
            } else {
              uploadImg(tempFiles);
            }
          });
        }
      }
    },
  });
}

function chooseMode(type: number): Array<string> {
  switch (type) {
    case 0:
      return ["album", "camera"];
    case 1:
      return ["camera"];
    default:
      return ["album"];
  }
}
// 加水印
async function draw(messList: Array<string>) {
  // @ts-ignore
  watermarkRef.value.addWaterMark({
    filePaths: model.imgList.map(({ url }) => url),
    fillTexts: messList,
  });
}

// 水印信息
function getMessList(): Promise<Array<string>> {
  return new Promise(resolve => {
    const messList: Array<string> = [];
    const { marker } = props.item;
    // 时间
    if (marker.some(i => i === 0)) {
      messList.push(new Date().toLocaleString());
    }
    // 姓名
    // if (marker.some(i => i === 2)) {
    //   messList.push(this.osService.modal.account?.name!);
    // }
    // 组织信息
    if (marker.some(i => i === 3)) {
      messList.push(companyInfo.value.name);
    }
    // 地点
    if (marker.some(i => i === 1)) {
      getPositionMess().then(res => {
        messList.push(res);
        resolve(messList);
      });
    } else {
      resolve(messList);
    }
  });
}

function uploadImg(tempFiles) {
  const tempArray: any = [];
  uni.showLoading({ title: "正在上传..." });
  // model.percent = 10;
  user.getObsKey().then(res => {
    tempFiles.map(async file => {
      const fileObj = (await OBSupload(file, res)) as FileInfo;
      tempArray.push(fileObj);
      // model.percent = (100 / tempFiles.length) * tempArray.length;
      model.values.push(fileObj);
      if (tempArray.length == tempFiles.length) {
        // model.percent = 0;
        uni.hideLoading();
      }
    });
    props.value[props.item.id] = model.values;
  });
}
// 获取地点信息
function getPositionMess(): Promise<string> {
  return new Promise(resolve => {
    AMap?.plugin("AMap.CitySearch", () => {
      const citySearch = new AMap.CitySearch();
      citySearch.getLocalCity((status: string, result: Record<string, any>) => {
        if (status === "complete" && result.info === "OK") {
          if (result && result.city && result.bounds) {
            const res = `${result.province || ""}${result.city || ""}`;
            resolve(res);
          }
        }
      });
    });
  });
}
watch(
  () => props.value[props.item.id],
  newV => {
    if (!newV) {
      model.values = [];
      props.value[props.item.id] = [];
    }
  }
);
</script>

<style scoped lang="scss">
.container {
  position: absolute;
  left: 0;
}
.showImgList {
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  .imgItem {
    width: 100px;
    height: 100px;
    position: relative;
    border-radius: 3px;
    .showimg {
      width: 100%;
      height: 100%;
    }
    .close {
      position: absolute;
      top: 0;
      right: 0;
      background: rgba($color: #000000, $alpha: 0.6);
      width: 23px;
      height: 23px;
      border-radius: 3px 3px 3px 13px;
    }
  }
}
</style>
