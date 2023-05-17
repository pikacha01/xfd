<template>
  <view class="uni-form-item">
    <file-preview
      :list="props.item.value"
      :download="props.item.download"
    ></file-preview>
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

<style lang="scss" scoped></style>
