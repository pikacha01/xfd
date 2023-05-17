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
      <!-- <video
        :id="`${props.item.id}-video`"
        class="video-js"
        controls
        preload="auto"
        width="640"
        height="264"
        data-setup="{}"
      >
        <source
          v-show="!value.isLive"
          src="https://resource.zhuyiyun.com/687442814080057345/0qA1v9i4PujbmwdlxLoGS.mp4"
          type="video/mp4"
        />
      </video> -->
      <view
        class="video-js"
        ref="videoRef"
        style="width: 100%; height: 100%"
      ></view>
    </uni-forms-item>
  </view>
</template>

<script lang="ts" setup>
import { onReady } from "@dcloudio/uni-app";
import { computed, onMounted, ref } from "vue";
// import videojs from "video.js";

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
var videoRef = ref(null);

const option = {
  // 播放前显示
  // poster
  autoplay: true,
  // 预加载 auto metadata加载视频长度等信息 none
  preload: false,
  controls: true,
  fluid: true,
  aspectRatio: "16:9",
  language: "zh-CN",
  liveui: true,
  techOrder: ["html5"],
  playbackRates: [1, 2, 3, 4, 6, 8],
  // 循环播放
  loop: false,
  // 静音
  muted: true,

  sourceOrder: true,
  flash: { hls: { withCredentials: false } },
  html5: { hls: { withCredentials: false } },
};

onReady(() => {
  console.log(videoRef);
});
onMounted(() => {
  console.log(videoRef.value);
  var video = document.createElement("video") as any;
  video.id = `${props.item.id}-video`;
  video.style = "width: 100%;height: 250px;";
  video.controls = true;
  var source = document.createElement("source");
  source.src = value.value?.src;
  video.appendChild(source);
  // @ts-ignore
  videoRef.value.$el.appendChild(video);
  // @ts-ignore
  videojs(`${props.item.id}-video`);
});

const value = computed(() => {
  if (props.value[props.item.id]) {
    return {
      src: props.value[props.item.id],
      isLive: props.value[props.item.id] ?? "".includes("m3u8"),
    };
  } else if (props.item.videoUrl) {
    return {
      src: props.item.videoUrl,
      isLive: props.item.live,
    };
  } else {
    return null;
  }
});
</script>

<style></style>
