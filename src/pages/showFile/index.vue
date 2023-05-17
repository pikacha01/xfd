<template>
  <mumu-preview :fileUrl="props.url" :value="true"></mumu-preview>
</template>

<script setup lang="ts">
import MumuPreview from "@/common/mumu-previewOffce/mumu-previewOffce.vue";
import { onLoad } from "@dcloudio/uni-app";

const props = defineProps({
  url: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
});
onLoad(() => {
  uni.setNavigationBarTitle({
    title: "预览-" + props.name,
  });
});
</script>

<style></style>
