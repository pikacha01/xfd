<template>
  <view class="uni-form-item">
    <rich-text
      @itemclick="itemclick"
      :nodes="props.item.value"
      class="rich-text"
    ></rich-text>
  </view>
</template>

<script lang="ts" setup>
const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});
// 富文本内a标签点击跳转
function itemclick(e) {
  if (e.detail.node.name == "a") {
    window.open(e.detail.node.attrs.href);
  }
}
</script>

<style>
.rich-text img {
  width: 250px;
  height: 250px;
}
</style>
