<template>
  <view class="wrap">
    <template v-for="item in list" :key="item.fileName">
      <view class="flex-jc mb20 mr20">
        <view v-if="fileCate.pic.includes(item.fileType)">
          <image
            class="img"
            mode="aspectFill"
            :src="item.url"
            @click="previewImg(item.url)"
          />
        </view>
        <view
          v-else-if="
            [
              ...fileCate.pdf,
              ...fileCate.excel,
              ...fileCate.ppt,
              ...fileCate.word,
            ].includes(item.fileType)
          "
          @click="previewFile(item)"
        >
          <view class="img file">
            <uni-icons
              custom-prefix="iconfont"
              :type="getType(item.fileType)"
              size="45"
            ></uni-icons>
            <view class="fileName text-ov">{{ item.fileName }}</view>
          </view>
          <!-- #ifndef H5 -->
          <!-- #endif -->
          <!-- #ifdef  H5 -->
          <!-- #endif -->
        </view>
        <view
          v-else-if="
            [...fileCate.video, ...fileCate.audio].includes(item.fileType)
          "
        >
          <view>
            <video
              style="width: 330px; height: 140px"
              class="img"
              play-btn-position="center"
              :src="item.url"
              @error="videoErrorCallback"
              show-progress
              controls
            ></video>
          </view>
        </view>
        <button
          hover-class="primary-hover"
          class="mt10 primary-button"
          size="mini"
          @click="dowload(item)"
          v-if="props.download"
        >
          下载
        </button>
      </view>
    </template>
  </view>
</template>

<script lang="ts" setup>
import { fileCate, FileInfo } from "@/constants/form";
import { getImage } from "@/utils/download";
const props = defineProps({
  list: {
    type: Array<FileInfo>,
    required: true,
  },
  download: {
    type: Boolean,
    default: false,
  },
});

/**
 * 图片预览
 * @param url
 */
function previewImg(url: string) {
  uni.previewImage({
    current: url,
    urls: props.list
      .filter(({ fileType }) => fileCate.pic.includes(fileType))
      .map(({ url }) => url),
  });
}
/**
 * 文件预览
 * @param url
 */
// #ifndef H5
// #endif

// #ifdef  H5
// #endif
function previewFile(file: FileInfo) {
  uni.navigateTo({
    url: `/pages/showFile/index?url=${file.url}&name=${file.fileName}`,
  });
}

/**
 * 下载文件
 * @param item
 */
function dowload(item: FileInfo) {
  //  #ifndef H5
  uni.downloadFile({
    url: item.url, //仅为示例，并非真实的资源
    success: res => {
      if (res.statusCode === 200) {
        const fs = uni.getFileSystemManager();
        fs.saveFile({
          tempFilePath: res.tempFilePath,
          success: r => {
            console.log("下载成功", r);
            uni.showToast({ title: "下载成功" });
          },
          fail() {
            uni.showToast({ title: "下载失败", icon: "error" });
          },
        });
      } else {
      }
    },
  });
  //  #endif
  //  #ifdef  H5
  getImage(item.url).then(res => {
    const myBlob = new Blob([res], { type: "image/jpeg" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(myBlob);
    a.download = item.fileName;
    a.click();
    a.remove();
    URL.revokeObjectURL(a.href);
  });
  //  #endif
}

function videoErrorCallback() {
  uni.showToast({ title: "播放出错！", icon: "error" });
}

function getType(type) {
  if (fileCate.excel.includes(type)) {
    return "icon-excel";
  } else if (fileCate.pdf.includes(type)) {
    return "icon-PDF";
  } else if (fileCate.video.includes(type)) {
    return "icon-shipin";
  } else if (fileCate.word.includes(type)) {
    return "icon-word";
  } else if (fileCate.audio.includes(type)) {
    return "icon-yinpinwenjian";
  } else if (fileCate.word.includes(type)) {
    return "icon-word";
  } else if (fileCate.ppt.includes(type)) {
    return "icon-ppt";
  } else {
    return "icon-wenjian";
  }
}
</script>

<style lang="scss">
.wrap {
  display: flex;
  flex-wrap: wrap;
}
.img {
  width: 100px;
  height: 100px;
  background-color: #eee;
  border-radius: 10rpx;
  display: block;
}
.file {
  font-size: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.fileName {
  width: 90px;
  text-align: center;
  margin-top: 10px;
}
</style>
