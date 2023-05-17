<template>
  <view class="flex uni-title">
    <!-- <uni-icons
      class="mr5"
      custom-prefix="iconfont"
      :type="'icon-' + props.item.tag"
      size="20"
    ></uni-icons> -->
    <text class="required" v-if="props.item.required">*</text>
    <text class="mr5">{{ props.item.label }}</text>
    <uni-tooltip v-if="props.item.note">
      <template #content>
        <div style="max-width: 250px">{{ props.item.note }}</div>
      </template>
      <uni-icons type="help" size="20" color="#606266"></uni-icons>
    </uni-tooltip>
  </view>
</template>

<script setup lang="ts">
const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});
</script>
