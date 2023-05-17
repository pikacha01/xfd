<template>
  <view class="uni-form-item">
    <file-preview :list="props.item.value"></file-preview>
  </view>
</template>

<script lang="ts" setup>
import filePreview from "@/common/file-preview/index.vue";

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});
</script>

<style>
.img {
  width: 100px;
  height: 100px;
  background-color: #eee;
  border-radius: 10rpx;
  margin-right: 10px;
}
</style>
